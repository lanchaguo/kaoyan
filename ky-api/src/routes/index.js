'use strict'
const Router = require('@koa/router')
const authCtrl = require('../controllers/authController')
const userCtrl = require('../controllers/userController')
const roleCtrl = require('../controllers/roleController')
const menuCtrl = require('../controllers/menuController')
const examRouter = require('./exam')
const targetRouter = require('./target')
const schoolRouter = require('./school')
const authMiddleware = require('../middlewares/auth')

const router = new Router({ prefix: '/api' })

// ===== 认证 =====
router.post('/auth/login', authCtrl.login.bind(authCtrl))

// ===== 刷题模块（公开，无需登录）=====
router.use(examRouter.routes())
router.use(examRouter.allowedMethods())

// ===== 目标选择模块（公开，无需登录）=====
router.use(targetRouter.routes())
router.use(targetRouter.allowedMethods())

// ===== 需要认证的路由 =====
router.use(authMiddleware)

router.get('/auth/userinfo', authCtrl.getUserInfo.bind(authCtrl))
router.get('/auth/menus', menuCtrl.getUserMenus.bind(menuCtrl))

// ===== 用户管理 =====
router.get('/users', userCtrl.list.bind(userCtrl))
router.post('/users', userCtrl.create.bind(userCtrl))
router.put('/users/:id', userCtrl.update.bind(userCtrl))
router.delete('/users/:id', userCtrl.remove.bind(userCtrl))
router.put('/users/:id/password', userCtrl.resetPassword.bind(userCtrl))
router.get('/users/:id/roles', userCtrl.getRoles.bind(userCtrl))

// ===== 角色管理 =====
router.get('/roles', roleCtrl.list.bind(roleCtrl))
router.post('/roles', roleCtrl.create.bind(roleCtrl))
router.put('/roles/:id', roleCtrl.update.bind(roleCtrl))
router.delete('/roles/:id', roleCtrl.remove.bind(roleCtrl))
router.get('/roles/:id/menus', roleCtrl.getMenuIds.bind(roleCtrl))

// ===== 菜单管理 =====
router.get('/menus', menuCtrl.list.bind(menuCtrl))
router.get('/menus/tree', menuCtrl.tree.bind(menuCtrl))
router.post('/menus', menuCtrl.create.bind(menuCtrl))
router.put('/menus/:id', menuCtrl.update.bind(menuCtrl))
router.delete('/menus/:id', menuCtrl.remove.bind(menuCtrl))

// ===== 院校信息模块 =====
router.use(schoolRouter.routes())
router.use(schoolRouter.allowedMethods())

module.exports = router
