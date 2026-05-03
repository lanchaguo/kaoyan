'use strict'
const { Direction, Major, ExamSubject } = require('../../models/schoolModels')

class DirectionController {
  // 方向列表（可按 major_id 筛选）
  async list(ctx) {
    const { page = 1, pageSize = 20, major_id, year } = ctx.query
    const where = {}
    if (major_id) where.major_id = major_id
    if (year) where.year = year

    const { count, rows } = await Direction.findAndCountAll({
      where,
      include: [{
        model: Major,
        as: 'major',
        attributes: ['id', 'name', 'code']
      }],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['id', 'ASC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  async create(ctx) {
    const { major_id, name, code, year = 2026, sort = 0 } = ctx.request.body
    if (!major_id || !name || !code) {
      ctx.body = { code: 400, message: '专业ID、方向名称和代码不能为空' }
      return
    }
    const [direction, created] = await Direction.findOrCreate({
      where: { major_id, code, year },
      defaults: { major_id, name, code, year, sort }
    })
    if (!created) {
      ctx.body = { code: 400, message: '该方向代码在本年度已存在' }
      return
    }
    ctx.body = { code: 200, message: '创建成功', data: { id: direction.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const { major_id, name, code, year, sort } = ctx.request.body
    const direction = await Direction.findByPk(id)
    if (!direction) {
      ctx.body = { code: 404, message: '方向不存在' }
      return
    }
    await direction.update({ major_id, name, code, year, sort })
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    const t = await Direction.sequelize.transaction()
    try {
      await ExamSubject.destroy({ where: { direction_id: id }, transaction: t })
      await Direction.destroy({ where: { id }, transaction: t })
      await t.commit()
      ctx.body = { code: 200, message: '删除成功' }
    } catch (e) {
      await t.rollback()
      ctx.body = { code: 500, message: '删除失败' }
    }
  }
}

module.exports = new DirectionController()
