import request from '@/utils/request'

export const getUserList = (params) => request.get('/users', { params })
export const createUser = (data) => request.post('/users', data)
export const updateUser = (id, data) => request.put(`/users/${id}`, data)
export const deleteUser = (id) => request.delete(`/users/${id}`)
export const resetPassword = (id, data) => request.put(`/users/${id}/password`, data)
export const getUserRoles = (id) => request.get(`/users/${id}/roles`)

export const getRoleList = (params) => request.get('/roles', { params })
export const createRole = (data) => request.post('/roles', data)
export const updateRole = (id, data) => request.put(`/roles/${id}`, data)
export const deleteRole = (id) => request.delete(`/roles/${id}`)
export const getRoleMenuIds = (id) => request.get(`/roles/${id}/menus`)

export const getMenuList = () => request.get('/menus')
export const getMenuTree = () => request.get('/menus/tree')
export const createMenu = (data) => request.post('/menus', data)
export const updateMenu = (id, data) => request.put(`/menus/${id}`, data)
export const deleteMenu = (id) => request.delete(`/menus/${id}`)
