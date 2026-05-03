import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册所有图标
Object.entries(ElIcons).forEach(([name, comp]) => app.component(name, comp))

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
