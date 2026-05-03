'use strict'
const { ExamSubject, Direction } = require('../../models/schoolModels')

class ExamSubjectController {
  // 考试科目列表
  async list(ctx) {
    const { page = 1, pageSize = 50, direction_id, year } = ctx.query
    const where = {}
    if (direction_id) where.direction_id = direction_id
    if (year) where.year = year

    const { count, rows } = await ExamSubject.findAndCountAll({
      where,
      include: [{
        model: Direction,
        as: 'direction',
        attributes: ['id', 'name', 'code']
      }],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['direction_id', 'ASC'], ['subject_order', 'ASC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  async create(ctx) {
    const { direction_id, subject_order, subject_name, subject_code, year = 2026 } = ctx.request.body
    if (!direction_id || !subject_order || !subject_name || !subject_code) {
      ctx.body = { code: 400, message: '方向ID、科目序号、科目名称和科目代码不能为空' }
      return
    }
    const [subject, created] = await ExamSubject.findOrCreate({
      where: { direction_id, subject_order, year },
      defaults: { direction_id, subject_order, subject_name, subject_code, year }
    })
    if (!created) {
      ctx.body = { code: 400, message: '该序号科目在本年度已存在' }
      return
    }
    ctx.body = { code: 200, message: '创建成功', data: { id: subject.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const { direction_id, subject_order, subject_name, subject_code, year } = ctx.request.body
    const subject = await ExamSubject.findByPk(id)
    if (!subject) {
      ctx.body = { code: 404, message: '考试科目不存在' }
      return
    }
    await subject.update({ direction_id, subject_order, subject_name, subject_code, year })
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    await ExamSubject.destroy({ where: { id } })
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new ExamSubjectController()
