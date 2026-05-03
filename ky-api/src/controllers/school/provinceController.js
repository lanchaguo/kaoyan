'use strict'
const { Op } = require('sequelize')
const { Province } = require('../../models/schoolModels')

class ProvinceController {
  // 省市列表（分页）
  async list(ctx) {
    const { page = 1, pageSize = 50, year, keyword } = ctx.query
    const where = {}
    if (year) where.year = year
    if (keyword) where.name = { [Op.like]: `%${keyword}%` }

    const { count, rows } = await Province.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })

    ctx.body = { code: 200, data: { total: count, list: rows, page: +page, pageSize: +pageSize } }
  }

  // 全部省市（下拉框用）
  async all(ctx) {
    const { year = 2026 } = ctx.query
    const rows = await Province.findAll({
      where: { year: year || 2026 },
      attributes: ['id', 'name', 'code'],
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })
    ctx.body = { code: 200, data: rows }
  }

  // 新增
  async create(ctx) {
    const { name, code, year = 2026, sort = 0 } = ctx.request.body
    if (!name || !code) {
      ctx.body = { code: 400, message: '名称和代码不能为空' }
      return
    }
    const [province, created] = await Province.findOrCreate({
      where: { code, year },
      defaults: { name, code, year, sort }
    })
    if (!created) {
      ctx.body = { code: 400, message: '该省市代码在本年度已存在' }
      return
    }
    ctx.body = { code: 200, message: '创建成功', data: { id: province.id } }
  }

  // 修改
  async update(ctx) {
    const { id } = ctx.params
    const { name, code, year, sort } = ctx.request.body
    const province = await Province.findByPk(id)
    if (!province) {
      ctx.body = { code: 404, message: '省市不存在' }
      return
    }
    await province.update({ name, code, year, sort })
    ctx.body = { code: 200, message: '更新成功' }
  }

  // 删除
  async remove(ctx) {
    const { id } = ctx.params
    await Province.destroy({ where: { id } })
    ctx.body = { code: 200, message: '删除成功' }
  }
}

module.exports = new ProvinceController()
