import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const userStore = useUserStore()
  console.log('[Request]', config.url, 'token:', userStore.token ? userStore.token.substring(0, 20) + '...' : 'none')
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  res => {
    const { code, message, data } = res.data
    if (code === 200) return res.data
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  err => {
    if (err.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    }
    ElMessage.error(err.response?.data?.message || '网络错误')
    return Promise.reject(err)
  }
)

export default request
