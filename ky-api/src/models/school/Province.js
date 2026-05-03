'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Province = sequelize.define('Province', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, comment: '省市名称' },
  code: { type: DataTypes.STRING(10), allowNull: false, comment: '省市代码(GB/T 2260)' },
  year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2026, comment: '数据年份' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0, comment: '排序' },
  status: { type: DataTypes.TINYINT, defaultValue: 1, comment: '状态 1启用 0禁用' }
}, {
  tableName: 'ky_province',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['code', 'year'] },
    { fields: ['year'] }
  ]
})

module.exports = Province
