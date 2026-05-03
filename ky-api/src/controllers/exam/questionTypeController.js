'use strict'
const { QuestionType } = require('../../models/examModels')

class QuestionTypeController {
  async list(ctx) {
    const rows = await QuestionType.findAll({ order: [['sort', 'ASC'], ['id', 'ASC']] })
    ctx.body = { code: 200, data: rows }
  }

  async create(ctx) {
    const { name, code, has_option, has_multi_answer, default_score, sort } = ctx.request.body
    if (!name || !code) {
      ctx.body = { code: 400, message: '题型名称和代码不能为空' }
      return
    }
    const exists = await QuestionType.findOne({ where: { code } })
    if (exists) {
      ctx.body = { code: 400, message: '题型代码已存在' }
      return
    }
    const item = await QuestionType.create({ name, code, has_option: has_option ?? 0, has_multi_answer: has_multi_answer ?? 0, default_score: default_score ?? 2, sort: sort || 0 })
    ctx.body = { code: 200, message: '创建成功', data: { id: item.id } }
  }

  async update(ctx) {
    const { id } = ctx.params
    const { name, has_option, has_multi_answer, default_score, sort } = ctx.request.body
    const item = await QuestionType.findByPk(id)
    if (!item) {
      ctx.body = { code: 404, message: '题型不存在' }
      return
    }
    await item.update({ name, has_option, has_multi_answer, default_score, sort })
    ctx.body = { code: 200, message: '更新成功' }
  }

  async remove(ctx) {
    const { id } = ctx.params
    await QuestionType.destroy({ where: { id } })
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new QuestionTypeController()
