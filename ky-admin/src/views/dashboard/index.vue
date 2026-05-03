<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <el-card shadow="never" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon" :style="{ background: item.color }">
              <el-icon :size="28"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="never" style="margin-top: 20px">
      <template #header>系统信息</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="系统名称">考研管理系统</el-descriptions-item>
        <el-descriptions-item label="当前用户">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</el-descriptions-item>
        <el-descriptions-item label="后端地址">http://localhost:3000</el-descriptions-item>
        <el-descriptions-item label="版本">v1.0.0</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const stats = [
  { label: '用户总数', value: '-', icon: 'User', color: '#409eff' },
  { label: '角色总数', value: '-', icon: 'UserFilled', color: '#67c23a' },
  { label: '菜单总数', value: '-', icon: 'Menu', color: '#e6a23c' },
  { label: '在线人数', value: '1', icon: 'Monitor', color: '#f56c6c' },
]
</script>

<style scoped>
.stat-card { border-radius: 8px; }
.stat-inner { display: flex; align-items: center; gap: 16px; padding: 8px 0; }
.stat-icon {
  width: 60px; height: 60px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
