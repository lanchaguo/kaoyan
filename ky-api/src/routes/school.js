'use strict'
const Router = require('@koa/router')
const provinceCtrl = require('../controllers/school/provinceController')
const schoolCtrl = require('../controllers/school/schoolController')
const directionCtrl = require('../controllers/school/directionController')
const examSubjectCtrl = require('../controllers/school/examSubjectController')

const router = new Router()

// 省市
router.get('/school/provinces', provinceCtrl.list.bind(provinceCtrl))
router.get('/school/provinces/all', provinceCtrl.all.bind(provinceCtrl))
router.post('/school/provinces', provinceCtrl.create.bind(provinceCtrl))
router.put('/school/provinces/:id', provinceCtrl.update.bind(provinceCtrl))
router.delete('/school/provinces/:id', provinceCtrl.remove.bind(provinceCtrl))

// 院校
router.get('/school/schools', schoolCtrl.list.bind(schoolCtrl))
router.get('/school/schools/:id', schoolCtrl.detail.bind(schoolCtrl))
router.post('/school/schools', schoolCtrl.create.bind(schoolCtrl))
router.put('/school/schools/:id', schoolCtrl.update.bind(schoolCtrl))
router.delete('/school/schools/:id', schoolCtrl.remove.bind(schoolCtrl))

// 方向
router.get('/school/directions', directionCtrl.list.bind(directionCtrl))
router.post('/school/directions', directionCtrl.create.bind(directionCtrl))
router.put('/school/directions/:id', directionCtrl.update.bind(directionCtrl))
router.delete('/school/directions/:id', directionCtrl.remove.bind(directionCtrl))

// 考试科目
router.get('/school/exam-subjects', examSubjectCtrl.list.bind(examSubjectCtrl))
router.post('/school/exam-subjects', examSubjectCtrl.create.bind(examSubjectCtrl))
router.put('/school/exam-subjects/:id', examSubjectCtrl.update.bind(examSubjectCtrl))
router.delete('/school/exam-subjects/:id', examSubjectCtrl.remove.bind(examSubjectCtrl))

module.exports = router
