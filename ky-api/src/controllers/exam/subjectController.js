'use strict'
const { Op } = require('sequelize')
const { Subject } = require('../../models/examModels')

class SubjectController {
  // 列表
  async list(ctx) {
    const { page = 1, pageSize = 10, name, status } = ctx.query
    const where = {}
    if (name) where.name = { [Op.like]: `%${name}%` }
    if (status !== undefined && status !== '') where.status = status

    const { count, rows } = await Subject.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  // 全部（下拉用）
  async all(ctx) {
    const rows = await Subject.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })
    ctx.body = { code: 200, data: rows }
  }

  // 新增
  async create(ctx) {
    const { name, code, icon, color, sort, status } = ctx.request.body
    if (!name || !code) {
      ctx.body = { code: 400, message: '学科名称和代码不能为空' }
      return
    }
    const exists = await Subject.findOne({ where: { code } })
    if (exists) {
      ctx.body = { code: 400, message: '学科代码已存在' }
      return
    }
    const item = await Subject.create({ name, code, icon, color, sort: sort || 0, status: status ?? 1 })
    ctx.body = { code: 200, message: '创建成功', data: { id: item.id } }
  }

  // 更新
  async update(ctx) {
    const { id } = ctx.params
    const { name, icon, color, sort, status } = ctx.request.body
    const item = await Subject.findByPk(id)
    if (!item) {
      ctx.body = { code: 404, message: '学科不存在' }
      return
    }
    await item.update({ name, icon, color, sort, status })
    ctx.body = { code: 200, message: '更新成功' }
  }

  // 删除
  async remove(ctx) {
    const { id } = ctx.params
    await Subject.destroy({ where: { id } })
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new SubjectController()
