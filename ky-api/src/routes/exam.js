'use strict'
const Router = require('@koa/router')
const subjectCtrl = require('../controllers/exam/subjectController')
const questionTypeCtrl = require('../controllers/exam/questionTypeController')
const knowledgeCtrl = require('../controllers/exam/knowledgeController')
const questionCtrl = require('../controllers/exam/questionController')
const paperCtrl = require('../controllers/exam/paperController')
const wrongCtrl = require('../controllers/exam/wrongController')
const recordCtrl = require('../controllers/exam/recordController')

const router = new Router()

// 学科
router.get('/exam/subjects', subjectCtrl.list.bind(subjectCtrl))
router.get('/exam/subjects/all', subjectCtrl.all.bind(subjectCtrl))
router.post('/exam/subjects', subjectCtrl.create.bind(subjectCtrl))
router.put('/exam/subjects/:id', subjectCtrl.update.bind(subjectCtrl))
router.delete('/exam/subjects/:id', subjectCtrl.remove.bind(subjectCtrl))

// 题型
router.get('/exam/types', questionTypeCtrl.list.bind(questionTypeCtrl))
router.post('/exam/types', questionTypeCtrl.create.bind(questionTypeCtrl))
router.put('/exam/types/:id', questionTypeCtrl.update.bind(questionTypeCtrl))
router.delete('/exam/types/:id', questionTypeCtrl.remove.bind(questionTypeCtrl))

// 知识点
router.get('/exam/knowledges/tree', knowledgeCtrl.tree.bind(knowledgeCtrl))
router.get('/exam/knowledges', knowledgeCtrl.list.bind(knowledgeCtrl))
router.post('/exam/knowledges', knowledgeCtrl.create.bind(knowledgeCtrl))
router.put('/exam/knowledges/:id', knowledgeCtrl.update.bind(knowledgeCtrl))
router.delete('/exam/knowledges/:id', knowledgeCtrl.remove.bind(knowledgeCtrl))

// 题目
router.get('/exam/questions', questionCtrl.list.bind(questionCtrl))
router.get('/exam/questions/:id', questionCtrl.detail.bind(questionCtrl))
router.post('/exam/questions', questionCtrl.create.bind(questionCtrl))
router.put('/exam/questions/:id', questionCtrl.update.bind(questionCtrl))
router.delete('/exam/questions/:id', questionCtrl.remove.bind(questionCtrl))

// 试卷
router.get('/exam/papers', paperCtrl.list.bind(paperCtrl))
router.get('/exam/papers/:id', paperCtrl.detail.bind(paperCtrl))
router.post('/exam/papers', paperCtrl.create.bind(paperCtrl))
router.put('/exam/papers/:id', paperCtrl.update.bind(paperCtrl))
router.delete('/exam/papers/:id', paperCtrl.remove.bind(paperCtrl))

// 错题本
router.get('/exam/wrongs', wrongCtrl.list.bind(wrongCtrl))

// 做题记录
router.get('/exam/records', recordCtrl.list.bind(recordCtrl))

module.exports = router
