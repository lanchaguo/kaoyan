const BASE_URL = 'http://localhost:3000/api'

/**
 * 封装 wx.request
 */
function request(options) {
  const app = getApp()
  const token = app.globalData && app.globalData.token || wx.getStorageSync('token')

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success(res) {
        const { code, message, data } = res.data
        if (code === 200) {
          resolve(res.data)
        } else if (code === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          if (app.globalData) app.globalData.token = ''
          wx.showToast({ title: '登录已过期', icon: 'none' })
          reject(new Error(message))
        } else {
          wx.showToast({ title: message || '请求失败', icon: 'none' })
          reject(new Error(message))
        }
      },
      fail(err) {
        wx.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

// ===== 认证 =====
const login = (data) => request({ url: '/auth/login', method: 'POST', data })
const getUserInfo = () => request({ url: '/auth/userinfo' })
const getUserMenus = () => request({ url: '/auth/menus' })

// ===== 用户管理 =====
const getUserList = (params) => request({ url: '/users', data: params })
const createUser = (data) => request({ url: '/users', method: 'POST', data })
const updateUser = (id, data) => request({ url: `/users/${id}`, method: 'PUT', data })
const deleteUser = (id) => request({ url: `/users/${id}`, method: 'DELETE' })
const resetPassword = (id, data) => request({ url: `/users/${id}/password`, method: 'PUT', data })

// ===== 角色管理 =====
const getRoleList = (params) => request({ url: '/roles', data: params })
const createRole = (data) => request({ url: '/roles', method: 'POST', data })
const updateRole = (id, data) => request({ url: `/roles/${id}`, method: 'PUT', data })
const deleteRole = (id) => request({ url: `/roles/${id}`, method: 'DELETE' })
const getRoleMenuIds = (id) => request({ url: `/roles/${id}/menus` })

// ===== 菜单管理 =====
const getMenuTree = () => request({ url: '/menus/tree' })
const createMenu = (data) => request({ url: '/menus', method: 'POST', data })
const updateMenu = (id, data) => request({ url: `/menus/${id}`, method: 'PUT', data })
const deleteMenu = (id) => request({ url: `/menus/${id}`, method: 'DELETE' })

// ===== 刷题模块 =====
const getSubjects = () => request({ url: '/exam/subjects' })
const getQuestions = (params) => request({ url: '/exam/questions', data: params })

// ===== 目标选择模块 =====
const getSchools = (params) => request({ url: '/target/schools', data: params })
const getInstitutes = (params) => request({ url: '/target/institutes', data: params })
const getMajors = (params) => request({ url: '/target/majors', data: params })
const getDirections = (params) => request({ url: '/target/directions', data: params })
const getDirectionSubjects = (params) => request({ url: '/target/direction-subjects', data: params })
const getMajorSubjects = (params) => request({ url: '/target/major-subjects', data: params })
const saveTarget = (data) => request({ url: '/target/save', method: 'POST', data })

module.exports = {
  login,
  getUserInfo,
  getUserMenus,
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getRoleMenuIds,
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  getSubjects,
  getQuestions,
  getSchools,
  getInstitutes,
  getMajors,
  getDirections,
  getDirectionSubjects,
  getMajorSubjects,
  saveTarget
}
