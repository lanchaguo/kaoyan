'use strict'
const Router = require('@koa/router')
const targetCtrl = require('../controllers/targetController')

const router = new Router()

// 学校列表
router.get('/target/schools', targetCtrl.getSchools.bind(targetCtrl))

// 学院列表
router.get('/target/institutes', targetCtrl.getInstitutes.bind(targetCtrl))

// 专业列表
router.get('/target/majors', targetCtrl.getMajors.bind(targetCtrl))

// 方向列表
router.get('/target/directions', targetCtrl.getDirections.bind(targetCtrl))

// 方向考试科目
router.get('/target/direction-subjects', targetCtrl.getDirectionSubjects.bind(targetCtrl))

// 专业科目（兼容旧接口）
router.get('/target/major-subjects', targetCtrl.getMajorSubjects.bind(targetCtrl))

// 保存用户目标
router.post('/target/save', targetCtrl.saveTarget.bind(targetCtrl))

module.exports = router
