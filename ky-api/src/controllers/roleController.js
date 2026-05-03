'use strict'
const Role = require('../models/Role')
const Menu = require('../models/Menu')
const { RoleMenu, UserRole } = require('../models/index')
const { Op } = require('sequelize')

class RoleController {
  async list(ctx) {
    const { page = 1, pageSize = 10, roleName, status } = ctx.query
    const where = {}
    if (roleName) where.role_name = { [Op.like]: `%${roleName}%` }
    if (status !== undefined && status !== '') where.status = status

    const { count, rows } = await Role.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['sort', 'ASC'], ['created_at', 'DESC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  async create(ctx) {
    const { role_name, role_key, sort, status, remark, menuIds } = ctx.request.body
    if (!role_name || !role_key) {
      ctx.body = { code: 400, message: '角色名称和标识不能为空' }
      return
    }
    const exists = await Role.findOne({ where: { role_key } })
    if (exists) {
      ctx.body = { code: 400, message: '角色标识已存在' }
      return
    }
    const role = await Role.create({ role_name, role_key, sort, status, remark })
    if (menuIds && menuIds.length > 0) {
      await RoleMenu.bulkCreate(menuIds.map(mid => ({ role_id: role.id, menu_id: mid })))
    }
    ctx.body = { code: 200, message: '创建成功', data: { id: role.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const { role_name, role_key, sort, status, remark, menuIds } = ctx.request.body
    const role = await Role.findByPk(id)
    if (!role) {
      ctx.body = { code: 404, message: '角色不存在' }
      return
    }
    await role.update({ role_name, role_key, sort, status, remark })
    if (menuIds !== undefined) {
      await RoleMenu.destroy({ where: { role_id: id } })
      if (menuIds.length > 0) {
        await RoleMenu.bulkCreate(menuIds.map(mid => ({ role_id: id, menu_id: mid })))
      }
    }
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    await Role.destroy({ where: { id } })
    await RoleMenu.destroy({ where: { role_id: id } })
    await UserRole.destroy({ where: { role_id: id } })
    ctx.body = { code: 200, message: '删除成功' }
  }

  async getMenuIds(ctx) {
    const { id } = ctx.params
    const items = await RoleMenu.findAll({ where: { role_id: id } })
    ctx.body = { code: 200, data: items.map(i => i.menu_id) }
  }
}

module.exports = new RoleController()
