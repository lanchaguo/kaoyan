'use strict'
const { Op } = require('sequelize')
const { Question, QuestionOption, QuestionKnowledge, Subject, QuestionType, Difficulty } = require('../../models/examModels')
const { renderMathToSvgHtml } = require('../../../utils/mathRenderer')

// 简单内存缓存：公式文本 → SVG HTML
const svgCache = new Map()
const MAX_CACHE_SIZE = 500

async function renderWithCache(text) {
  if (!text) return ''
  if (svgCache.has(text)) {
    return svgCache.get(text)
  }
  const result = await renderMathToSvgHtml(text)
  if (svgCache.size >= MAX_CACHE_SIZE) {
    // 简单清理：清空一半
    const keys = Array.from(svgCache.keys())
    for (let i = 0; i < keys.length / 2; i++) {
      svgCache.delete(keys[i])
    }
  }
  svgCache.set(text, result)
  return result
}

// 为题目列表添加 stem_svg / analysis_svg 字段
async function addSvgFields(list) {
  const results = await Promise.all(list.map(async (item) => {
    const obj = item.toJSON ? item.toJSON() : item
    if (obj.stem) {
      obj.stem_svg = await renderWithCache(obj.stem)
    }
    if (obj.analysis) {
      obj.analysis_svg = await renderWithCache(obj.analysis)
    }
    return obj
  }))
  return results
}

class QuestionController {
  // 列表
  async list(ctx) {
    const { page = 1, pageSize = 10, subject_id, type_id, difficulty_id, year, keyword } = ctx.query
    const where = {}
    if (subject_id) where.subject_id = subject_id
    if (type_id) where.type_id = type_id
    if (difficulty_id) where.difficulty_id = difficulty_id
    if (year) where.year = year
    if (keyword) where.stem = { [Op.like]: `%${keyword}%` }

    const { count, rows } = await Question.findAndCountAll({
      where,
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name'] },
        { model: QuestionType, as: 'type', attributes: ['id', 'name'] },
        { model: Difficulty, as: 'difficulty', attributes: ['id', 'name', 'color'] }
      ],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['id', 'DESC']]
    })

    // 添加渲染后的数学公式 SVG
    const listWithSvg = await addSvgFields(rows)

    ctx.body = { code: 200, data: { total: count, list: listWithSvg, page: +page, pageSize: +pageSize } }
  }

  // 详情（含选项和知识点）
  async detail(ctx) {
    const { id } = ctx.params
    const question = await Question.findByPk(id, {
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name'] },
        { model: QuestionType, as: 'type', attributes: ['id', 'name', 'has_option'] },
        { model: Difficulty, as: 'difficulty', attributes: ['id', 'name', 'color'] },
        { model: QuestionOption, as: 'options', order: [['sort', 'ASC']] },
        { model: QuestionKnowledge, as: 'questionKnowledges', attributes: ['knowledge_id'] }
      ]
    })
    if (!question) {
      ctx.body = { code: 404, message: '题目不存在' }
      return
    }
    
    // 添加渲染后的数学公式 SVG
    const questionObj = question.toJSON()
    if (questionObj.stem) {
      questionObj.stem_svg = await renderWithCache(questionObj.stem)
    }
    if (questionObj.analysis) {
      questionObj.analysis_svg = await renderWithCache(questionObj.analysis)
    }
    
    ctx.body = { code: 200, data: { question: questionObj } }
  }

  // 新增
  async create(ctx) {
    const { subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, option_list, knowledge_ids } = ctx.request.body
    if (!subject_id || !type_id || !stem) {
      ctx.body = { code: 400, message: '学科、题型和题干不能为空' }
      return
    }

    const question = await Question.create({
      subject_id, type_id, difficulty_id: difficulty_id || 1,
      stem, analysis, answer,
      score: score || 2, year: year || 0, source, is_official: is_official ?? 1,
      exam_session: exam_session || '初试'
    })

    // 写入选项
    if (option_list && option_list.length > 0) {
      const options = option_list.map((o, i) => ({
        question_id: question.id,
        option_key: o.option_key,
        option_value: o.option_value,
        is_correct: o.is_correct ? 1 : 0,
        sort: i
      }))
      await QuestionOption.bulkCreate(options)
    }

    // 写入知识点关联
    if (knowledge_ids && knowledge_ids.length > 0) {
      const kws = knowledge_ids.map(kid => ({ question_id: question.id, knowledge_id: kid }))
      await QuestionKnowledge.bulkCreate(kws)
    }

    ctx.body = { code: 200, message: '创建成功', data: { id: question.id } }
  }

  // 更新
  async update(ctx) {
    const { id } = ctx.params
    const { subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, option_list, knowledge_ids } = ctx.request.body

    const question = await Question.findByPk(id)
    if (!question) {
      ctx.body = { code: 404, message: '题目不存在' }
      return
    }

    await question.update({
      subject_id, type_id, difficulty_id: difficulty_id || 1,
      stem, analysis, answer,
      score: score || 2, year: year || 0, source, is_official: is_official ?? 1,
      exam_session: exam_session || '初试'
    })

    // 更新选项
    if (option_list !== undefined) {
      await QuestionOption.destroy({ where: { question_id: id } })
      if (option_list.length > 0) {
        const options = option_list.map((o, i) => ({
          question_id: id,
          option_key: o.option_key,
          option_value: o.option_value,
          is_correct: o.is_correct ? 1 : 0,
          sort: i
        }))
        await QuestionOption.bulkCreate(options)
      }
    }

    // 更新知识点
    if (knowledge_ids !== undefined) {
      await QuestionKnowledge.destroy({ where: { question_id: id } })
      if (knowledge_ids.length > 0) {
        const kws = knowledge_ids.map(kid => ({ question_id: id, knowledge_id: kid }))
        await QuestionKnowledge.bulkCreate(kws)
      }
    }

    ctx.body = { code: 200, message: '更新成功' }
  }

  // 删除
  async remove(ctx) {
    const { id } = ctx.params
    await Question.destroy({ where: { id } })
    await QuestionOption.destroy({ where: { question_id: id } })
    await QuestionKnowledge.destroy({ where: { question_id: id } })
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new QuestionController()
