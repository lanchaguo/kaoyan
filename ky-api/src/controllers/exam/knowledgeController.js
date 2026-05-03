'use strict'
const { Op } = require('sequelize')
const { KnowledgePoint } = require('../../models/examModels')

class KnowledgeController {
  // 树形列表
  async tree(ctx) {
    const { subject_id } = ctx.query
    const where = {}
    if (subject_id) where.subject_id = subject_id

    const rows = await KnowledgePoint.findAll({
      where,
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })

    // 转树形
    const map = {}
    const roots = []
    rows.forEach(item => {
      map[item.id] = { ...item.get() }
    })
    rows.forEach(item => {
      if (item.parent_id === 0 || !map[item.parent_id]) {
        roots.push(map[item.id])
      } else {
        if (!map[item.parent_id].children) map[item.parent_id].children = []
        map[item.parent_id].children.push(map[item.id])
      }
    })

    ctx.body = { code: 200, data: roots }
  }

  // 列表（分页）
  async list(ctx) {
    const { page = 1, pageSize = 10, subject_id, name } = ctx.query
    const where = {}
    if (subject_id) where.subject_id = subject_id
    if (name) where.name = { [Op.like]: `%${name}%` }

    const { count, rows } = await KnowledgePoint.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  async create(ctx) {
    const { subject_id, parent_id, name, sort } = ctx.request.body
    if (!subject_id || !name) {
      ctx.body = { code: 400, message: '学科和知识点名称不能为空' }
      return
    }
    const item = await KnowledgePoint.create({ subject_id, parent_id: parent_id || 0, name, sort: sort || 0 })
    ctx.body = { code: 200, message: '创建成功', data: { id: item.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const { name, sort } = ctx.request.body
    const item = await KnowledgePoint.findByPk(id)
    if (!item) {
      ctx.body = { code: 404, message: '知识点不存在' }
      return
    }
    await item.update({ name, sort })
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    // 递归删除子节点
    const deleteRecursively = async (pid) => {
      const children = await KnowledgePoint.findAll({ where: { parent_id: pid } })
      for (const child of children) {
        await deleteRecursively(child.id)
      }
      await KnowledgePoint.destroy({ where: { id: pid } })
    }
    await deleteRecursively(id)
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new KnowledgeController()
