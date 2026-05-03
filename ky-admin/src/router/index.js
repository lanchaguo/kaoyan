import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      // 系统管理
      {
        path: 'system',
        name: 'System',
        redirect: '/system/user',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: 'user',
            name: 'UserManage',
            component: () => import('@/views/system/user/index.vue'),
            meta: { title: '用户管理', icon: 'User', perms: 'system:user:list' }
          },
          {
            path: 'role',
            name: 'RoleManage',
            component: () => import('@/views/system/role/index.vue'),
            meta: { title: '角色管理', icon: 'UserFilled', perms: 'system:role:list' }
          },
          {
            path: 'menu',
            name: 'MenuManage',
            component: () => import('@/views/system/menu/index.vue'),
            meta: { title: '菜单管理', icon: 'Menu', perms: 'system:menu:list' }
          }
        ]
      },
      // 刷题管理
      {
        path: 'exam',
        name: 'Exam',
        redirect: '/exam/subject',
        meta: { title: '刷题管理', icon: 'Document' },
        children: [
          {
            path: 'subject',
            name: 'SubjectManage',
            component: () => import('@/views/exam/subject/index.vue'),
            meta: { title: '学科管理', icon: 'Collection', perms: 'exam:subject:list' }
          },
          {
            path: 'type',
            name: 'TypeManage',
            component: () => import('@/views/exam/type/index.vue'),
            meta: { title: '题型管理', icon: 'Grid', perms: 'exam:type:list' }
          },
          {
            path: 'knowledge',
            name: 'KnowledgeManage',
            component: () => import('@/views/exam/knowledge/index.vue'),
            meta: { title: '知识点管理', icon: 'Tickets', perms: 'exam:knowledge:list' }
          },
          {
            path: 'question',
            name: 'QuestionManage',
            component: () => import('@/views/exam/question/index.vue'),
            meta: { title: '题目管理', icon: 'Reading', perms: 'exam:question:list' }
          },
          {
            path: 'paper',
            name: 'PaperManage',
            component: () => import('@/views/exam/paper/index.vue'),
            meta: { title: '试卷管理', icon: 'Collection', perms: 'exam:paper:list' }
          },
          {
            path: 'wrong',
            name: 'WrongManage',
            component: () => import('@/views/exam/wrong/index.vue'),
            meta: { title: '错题本', icon: 'WarningFilled', perms: 'exam:wrong:list' }
          },
          {
            path: 'record',
            name: 'RecordManage',
            component: () => import('@/views/exam/record/index.vue'),
            meta: { title: '做题记录', icon: 'Clock', perms: 'exam:record:list' }
          }
        ]
      },
      // 院校信息
      {
        path: 'school',
        name: 'School',
        redirect: '/school/province',
        meta: { title: '院校信息', icon: 'School' },
        children: [
          {
            path: 'province',
            name: 'ProvinceManage',
            component: () => import('@/views/school/province/index.vue'),
            meta: { title: '省市列表', icon: 'Location', perms: 'school:province:list' }
          },
          {
            path: 'school',
            name: 'SchoolManage',
            component: () => import('@/views/school/school/index.vue'),
            meta: { title: '院校列表', icon: 'OfficeBuilding', perms: 'school:school:list' }
          }
        ]
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
