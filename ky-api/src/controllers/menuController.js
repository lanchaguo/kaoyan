'use strict'
const Menu = require('../models/Menu')
const { RoleMenu, UserRole } = require('../models/index')
const Role = require('../models/Role')

class MenuController {
  async list(ctx) {
    const menus = await Menu.findAll({ order: [['sort', 'ASC']] })
    ctx.body = { code: 200, data: menus }
  }

  async tree(ctx) {
    const menus = await Menu.findAll({ order: [['sort', 'ASC']] })
    ctx.body = { code: 200, data: buildTree(menus) }
  }

  async create(ctx) {
    const body = ctx.request.body
    if (!body.menu_name) {
      ctx.body = { code: 400, message: '菜单名称不能为空' }
      return
    }
    const menu = await Menu.create(body)
    ctx.body = { code: 200, message: '创建成功', data: { id: menu.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const menu = await Menu.findByPk(id)
    if (!menu) {
      ctx.body = { code: 404, message: '菜单不存在' }
      return
    }
    await menu.update(ctx.request.body)
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    await Menu.destroy({ where: { id } })
    await RoleMenu.destroy({ where: { menu_id: id } })
    ctx.body = { code: 200, message: '删除成功' }
  }

  // 获取当前用户的菜单权限
  async getUserMenus(ctx) {
    const { id } = ctx.state.user
    const userRoles = await UserRole.findAll({ where: { user_id: id } })
    const roleIds = userRoles.map(r => r.role_id)

    if (roleIds.length === 0) {
      ctx.body = { code: 200, data: [] }
      return
    }

    const roleMenus = await RoleMenu.findAll({ where: { role_id: roleIds } })
    const menuIds = [...new Set(roleMenus.map(m => m.menu_id))]

    const menus = await Menu.findAll({
      where: { id: menuIds, status: 1 },
      order: [['sort', 'ASC']]
    })

    ctx.body = { code: 200, data: buildTree(menus) }
  }
}

function buildTree(menus, parentId = 0) {
  return menus
    .filter(m => m.parent_id === parentId)
    .map(m => ({
      ...m.toJSON(),
      children: buildTree(menus, m.id)
    }))
}

module.exports = new MenuController()
