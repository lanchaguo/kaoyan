'use strict'
const { Op } = require('sequelize')
const { Paper, PaperQuestion, Question, Subject } = require('../../models/examModels')

class PaperController {
  async list(ctx) {
    const { page = 1, pageSize = 10, subject_id, year } = ctx.query
    const where = {}
    if (subject_id) where.subject_id = subject_id
    if (year) where.year = year

    const { count, rows } = await Paper.findAndCountAll({
      where,
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name'] }],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['year', 'DESC'], ['id', 'DESC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  async detail(ctx) {
    const { id } = ctx.params
    const paper = await Paper.findByPk(id, {
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name'] },
        {
          model: PaperQuestion, as: 'paperQuestions',
          include: [{ model: Question, as: 'question' }],
          order: [['sort_num', 'ASC']]
        }
      ]
    })
    if (!paper) {
      ctx.body = { code: 404, message: '试卷不存在' }
      return
    }
    ctx.body = { code: 200, data: paper }
  }

  async create(ctx) {
    const { subject_id, name, year, session, total_score, total_time, difficulty_id, description } = ctx.request.body
    if (!subject_id || !name) {
      ctx.body = { code: 400, message: '学科和试卷名称不能为空' }
      return
    }
    const item = await Paper.create({
      subject_id, name, year: year || 0, session: session || '初试',
      total_score: total_score || 100, total_time: total_time || 180,
      difficulty_id: difficulty_id || 1, description
    })
    ctx.body = { code: 200, message: '创建成功', data: { id: item.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const { name, year, session, total_score, total_time, difficulty_id, description, status } = ctx.request.body
    const item = await Paper.findByPk(id)
    if (!item) {
      ctx.body = { code: 404, message: '试卷不存在' }
      return
    }
    await item.update({ name, year, session, total_score, total_time, difficulty_id, description, status })
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    await Paper.destroy({ where: { id } })
    await PaperQuestion.destroy({ where: { paper_id: id } })
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new PaperController()
