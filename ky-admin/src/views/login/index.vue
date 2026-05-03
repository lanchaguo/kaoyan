<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="title">考研管理系统</div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" style="width:100%" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({ username: 'admin', password: 'admin123' })
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
}

const handleLogin = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    await userStore.fetchMenus() // 获取动态菜单
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch {
    // 错误已由 axios 拦截器处理
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.login-box {
  width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 40px 40px 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
}
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 32px;
  letter-spacing: 2px;
}
</style>
