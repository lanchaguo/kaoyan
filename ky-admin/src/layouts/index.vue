<template>
  <el-container class="layout-wrap">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <span v-if="!isCollapse">考研管理系统</span>
        <span v-else>KY</span>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        background-color="#001529"
        text-color="#ffffffb3"
        active-text-color="#ffffff"
        router
        unique-opened
      >
        <!-- 首页固定 -->
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <!-- 动态菜单：从后端获取 -->
        <template v-for="menu in userStore.menus" :key="menu.id">
          <!-- 目录型菜单 (M) -->
          <el-sub-menu v-if="menu.menu_type === 'M' && menu.children && menu.children.length" :index="'/' + menu.path.split('/').filter(Boolean)[0]">
            <template #title>
              <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
              <span>{{ menu.menu_name }}</span>
            </template>
            <template v-for="child in menu.children" :key="child.id">
              <!-- 菜单型 (C) -->
              <el-menu-item v-if="child.menu_type === 'C'" :index="'/' + menu.path.split('/').filter(Boolean)[0] + '/' + child.path">
                <el-icon><component :is="child.icon || 'Menu'" /></el-icon>
                <template #title>{{ child.menu_name }}</template>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <!-- 单菜单项 (C) -->
          <el-menu-item v-else-if="menu.menu_type === 'C'" :index="'/' + menu.path">
            <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
            <template #title>{{ menu.menu_name }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" /><Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="main">
        <el-container direction="vertical" class="content-wrap">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

// 页面加载时获取动态菜单
onMounted(async () => {
  if (userStore.token && !userStore.menus.length) {
    await userStore.fetchMenus()
  }
})

const handleCommand = async (cmd) => {
  if (cmd === 'logout') {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-wrap { height: 100vh; }
.aside { background: #001529; transition: width .2s; overflow: hidden; }
.logo {
  height: 60px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 18px; font-weight: bold;
  background: #002140; white-space: nowrap; overflow: hidden;
}
.header {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; border-bottom: 1px solid #f0f0f0; padding: 0 20px;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.collapse-btn { font-size: 20px; cursor: pointer; color: #606266; }
.header-right { display: flex; align-items: center; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #606266; }
.username { font-size: 14px; }
.main {
  background: #f5f7fa;
  padding: 16px 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}
.content-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
