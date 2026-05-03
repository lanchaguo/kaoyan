import request from '@/utils/request'

// ===== 省市管理 =====
export const getProvinces = (params) => request({ url: '/school/provinces', params })
export const getProvincesAll = (params) => request({ url: '/school/provinces/all', params })
export const createProvince = (data) => request({ url: '/school/provinces', method: 'POST', data })
export const updateProvince = (id, data) => request({ url: `/school/provinces/${id}`, method: 'PUT', data })
export const deleteProvince = (id) => request({ url: `/school/provinces/${id}`, method: 'DELETE' })

// ===== 院校管理 =====
export const getSchools = (params) => request({ url: '/school/schools', params })
export const getSchoolDetail = (id) => request({ url: `/school/schools/${id}` })
export const createSchool = (data) => request({ url: '/school/schools', method: 'POST', data })
export const updateSchool = (id, data) => request({ url: `/school/schools/${id}`, method: 'PUT', data })
export const deleteSchool = (id) => request({ url: `/school/schools/${id}`, method: 'DELETE' })

// ===== 方向管理 =====
export const getDirections = (params) => request({ url: '/school/directions', params })
export const createDirection = (data) => request({ url: '/school/directions', method: 'POST', data })
export const updateDirection = (id, data) => request({ url: `/school/directions/${id}`, method: 'PUT', data })
export const deleteDirection = (id) => request({ url: `/school/directions/${id}`, method: 'DELETE' })

// ===== 考试科目管理 =====
export const getExamSubjects = (params) => request({ url: '/school/exam-subjects', params })
export const createExamSubject = (data) => request({ url: '/school/exam-subjects', method: 'POST', data })
export const updateExamSubject = (id, data) => request({ url: `/school/exam-subjects/${id}`, method: 'PUT', data })
export const deleteExamSubject = (id) => request({ url: `/school/exam-subjects/${id}`, method: 'DELETE' })
