import request from '@/utils/request'

// 学科
export const getSubjects = (params) => request({ url: '/exam/subjects', params })
export const getSubjectsAll = () => request({ url: '/exam/subjects/all' })
export const createSubject = (data) => request({ url: '/exam/subjects', method: 'POST', data })
export const updateSubject = (id, data) => request({ url: `/exam/subjects/${id}`, method: 'PUT', data })
export const deleteSubject = (id) => request({ url: `/exam/subjects/${id}`, method: 'DELETE' })

// 题型
export const getTypes = (params) => request({ url: '/exam/types', params })
export const createType = (data) => request({ url: '/exam/types', method: 'POST', data })
export const updateType = (id, data) => request({ url: `/exam/types/${id}`, method: 'PUT', data })
export const deleteType = (id) => request({ url: `/exam/types/${id}`, method: 'DELETE' })

// 知识点
export const getKnowledgesTree = (params) => request({ url: '/exam/knowledges/tree', params })
export const getKnowledges = (params) => request({ url: '/exam/knowledges', params })
export const createKnowledge = (data) => request({ url: '/exam/knowledges', method: 'POST', data })
export const updateKnowledge = (id, data) => request({ url: `/exam/knowledges/${id}`, method: 'PUT', data })
export const deleteKnowledge = (id) => request({ url: `/exam/knowledges/${id}`, method: 'DELETE' })

// 题目
export const getQuestions = (params) => request({ url: '/exam/questions', params })
export const getQuestionDetail = (id) => request({ url: `/exam/questions/${id}` })
export const createQuestion = (data) => request({ url: '/exam/questions', method: 'POST', data })
export const updateQuestion = (id, data) => request({ url: `/exam/questions/${id}`, method: 'PUT', data })
export const deleteQuestion = (id) => request({ url: `/exam/questions/${id}`, method: 'DELETE' })

// 试卷
export const getPapers = (params) => request({ url: '/exam/papers', params })
export const getPaperDetail = (id) => request({ url: `/exam/papers/${id}` })
export const createPaper = (data) => request({ url: '/exam/papers', method: 'POST', data })
export const updatePaper = (id, data) => request({ url: `/exam/papers/${id}`, method: 'PUT', data })
export const deletePaper = (id) => request({ url: `/exam/papers/${id}`, method: 'DELETE' })

// 错题本
export const getWrongs = (params) => request({ url: '/exam/wrongs', params })

// 做题记录
export const getRecords = (params) => request({ url: '/exam/records', params })
