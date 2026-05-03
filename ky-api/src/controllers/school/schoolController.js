'use strict'
const { Op } = require('sequelize')
const { School, Province, Institute, Major, Direction, ExamSubject } = require('../../models/schoolModels')

class SchoolController {
  // 院校列表（分页 + 省市筛选）
  async list(ctx) {
    const { page = 1, pageSize = 20, year, province_code, keyword } = ctx.query
    const where = {}
    if (year) where.year = year
    if (province_code) where.province_code = province_code
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { code: { [Op.like]: `%${keyword}%` } }
      ]
    }

    const { count, rows } = await School.findAndCountAll({
      where,
      include: [
        { model: Province, as: 'provinceInfo', attributes: ['id', 'name', 'code'] }
      ],
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  // 院校详情（含学院→专业→方向→科目层级）
  async detail(ctx) {
    const { id } = ctx.params
    const school = await School.findByPk(id, {
      include: [
        { model: Province, as: 'provinceInfo', attributes: ['id', 'name', 'code'] }
      ]
    })
    if (!school) {
      ctx.body = { code: 404, message: '院校不存在' }
      return
    }

    // 加载学院层级
    const institutes = await Institute.findAll({
      where: { school_id: id },
      order: [['sort', 'ASC'], ['id', 'ASC']],
      include: [{
        model: Major,
        as: 'majors',
        order: [['sort', 'ASC'], ['id', 'ASC']],
        include: [{
          model: Direction,
          as: 'directions',
          order: [['sort', 'ASC'], ['id', 'ASC']],
          include: [{
            model: ExamSubject,
            as: 'examSubjects',
            attributes: ['id', 'subject_order', 'subject_name', 'subject_code'],
            order: [['subject_order', 'ASC']]
          }]
        }]
      }]
    })

    ctx.body = { code: 200, data: { ...school.toJSON(), institutes } }
  }

  // 新增
  async create(ctx) {
    const { name, code, province_code, year = 2026, sort = 0 } = ctx.request.body
    if (!name || !code) {
      ctx.body = { code: 400, message: '院校名称和代码不能为空' }
      return
    }
    const [school, created] = await School.findOrCreate({
      where: { code, year },
      defaults: { name, code, province_code: province_code || '', year, sort }
    })
    if (!created) {
      ctx.body = { code: 400, message: '该院校代码在本年度已存在' }
      return
    }
    ctx.body = { code: 200, message: '创建成功', data: { id: school.id } }
  }

  // 修改
  async update(ctx) {
    const { id } = ctx.params
    const { name, code, province_code, year, sort } = ctx.request.body
    const school = await School.findByPk(id)
    if (!school) {
      ctx.body = { code: 404, message: '院校不存在' }
      return
    }
    await school.update({ name, code, province_code: province_code || '', year, sort })
    ctx.body = { code: 200, message: '更新成功' }
  }

  // 删除（级联删除学院、专业、方向、科目）
  async remove(ctx) {
    const { id } = ctx.params
    const t = await School.sequelize.transaction()
    try {
      // 找出所有学院
      const institutes = await Institute.findAll({ where: { school_id: id }, transaction: t })
      const instituteIds = institutes.map(i => i.id)

      // 找出所有专业
      if (instituteIds.length > 0) {
        const majors = await Major.findAll({ where: { institute_id: instituteIds }, transaction: t })
        const majorIds = majors.map(m => m.id)

        // 删除方向
        if (majorIds.length > 0) {
          const directions = await Direction.findAll({ where: { major_id: majorIds }, transaction: t })
          const directionIds = directions.map(d => d.id)
          if (directionIds.length > 0) {
            await ExamSubject.destroy({ where: { direction_id: directionIds }, transaction: t })
          }
          await Direction.destroy({ where: { major_id: majorIds }, transaction: t })
        }
        await Major.destroy({ where: { institute_id: instituteIds }, transaction: t })
      }
      await Institute.destroy({ where: { school_id: id }, transaction: t })
      await School.destroy({ where: { id }, transaction: t })

      await t.commit()
      ctx.body = { code: 200, message: '删除成功（含下级）' }
    } catch (e) {
      await t.rollback()
      ctx.body = { code: 500, message: '删除失败: ' + e.message }
    }
  }
}

module.exports = new SchoolController()
