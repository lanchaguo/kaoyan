'use strict'
const { Op } = require('sequelize')
const { UserAnswer, Question, Subject, QuestionType } = require('../../models/examModels')

class RecordController {
  async list(ctx) {
    const { page = 1, pageSize = 10, user_id, is_correct } = ctx.query
    const where = {}
    if (user_id) where.user_id = user_id
    if (is_correct !== undefined) where.is_correct = is_correct

    const { count, rows } = await UserAnswer.findAndCountAll({
      where,
      include: [
        {
          model: Question, as: 'question',
          include: [
            { model: Subject, as: 'subject', attributes: ['id', 'name'] },
            { model: QuestionType, as: 'type', attributes: ['id', 'name'] }
          ]
        }
      ],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['answered_at', 'DESC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }
}

module.exports = new RecordController()
