'use strict'
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const User = require('../models/User')
const Role = require('../models/Role')
const { UserRole } = require('../models/index')

class UserController {
  // 获取用户列表（分页）
  async list(ctx) {
    const { page = 1, pageSize = 10, username, status } = ctx.query
    const where = {}
    if (username) where.username = { [Op.like]: `%${username}%` }
    if (status !== undefined && status !== '') where.status = status

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['created_at', 'DESC']]
    })

    ctx.body = {
      code: 200,
      data: {
        total: count,
        list: rows,
        page: +page,
        pageSize: +pageSize
      }
    }
  }

  // 新增用户
  async create(ctx) {
    const { username, password, nickname, email, phone, status, remark, roleIds } = ctx.request.body
    if (!username || !password) {
      ctx.body = { code: 400, message: '用户名和密码不能为空' }
      return
    }

    const exists = await User.findOne({ where: { username } })
    if (exists) {
      ctx.body = { code: 400, message: '用户名已存在' }
      return
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash, nickname, email, phone, status, remark })

    if (roleIds && roleIds.length > 0) {
      await UserRole.bulkCreate(roleIds.map(rid => ({ user_id: user.id, role_id: rid })))
    }

    ctx.body = { code: 200, message: '创建成功', data: { id: user.id } }
  }

  // 更新用户
  async update(ctx) {
    const { id } = ctx.params
    const { nickname, email, phone, status, remark, roleIds } = ctx.request.body

    const user = await User.findByPk(id)
    if (!user) {
      ctx.body = { code: 404, message: '用户不存在' }
      return
    }

    await user.update({ nickname, email, phone, status, remark })

    if (roleIds !== undefined) {
      await UserRole.destroy({ where: { user_id: id } })
      if (roleIds.length > 0) {
        await UserRole.bulkCreate(roleIds.map(rid => ({ user_id: id, role_id: rid })))
      }
    }

    ctx.body = { code: 200, message: '更新成功' }
  }

  // 删除用户
  async remove(ctx) {
    const { id } = ctx.params
    await User.destroy({ where: { id } })
    await UserRole.destroy({ where: { user_id: id } })
    ctx.body = { code: 200, message: '删除成功' }
  }

  // 重置密码
  async resetPassword(ctx) {
    const { id } = ctx.params
    const { password } = ctx.request.body
    if (!password) {
      ctx.body = { code: 400, message: '新密码不能为空' }
      return
    }
    const hash = await bcrypt.hash(password, 10)
    await User.update({ password: hash }, { where: { id } })
    ctx.body = { code: 200, message: '密码重置成功' }
  }

  // 获取用户角色
  async getRoles(ctx) {
    const { id } = ctx.params
    const userRoles = await UserRole.findAll({ where: { user_id: id } })
    ctx.body = { code: 200, data: userRoles.map(r => r.role_id) }
  }
}

module.exports = new UserController()
