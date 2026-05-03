'use strict'
const { Op } = require('sequelize')
const { WrongQuestion, Question, Subject, QuestionType, Difficulty, QuestionOption } = require('../../models/examModels')

class WrongController {
  async list(ctx) {
    const { page = 1, pageSize = 10, user_id } = ctx.query
    const where = {}
    if (user_id) where.user_id = user_id

    const { count, rows } = await WrongQuestion.findAndCountAll({
      where,
      include: [
        {
          model: Question, as: 'question',
          include: [
            { model: Subject, as: 'subject', attributes: ['id', 'name'] },
            { model: QuestionType, as: 'type', attributes: ['id', 'name'] },
            { model: Difficulty, as: 'difficulty', attributes: ['id', 'name', 'color'] }
          ]
        }
      ],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['created_at', 'DESC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }
}

module.exports = new WrongController()
