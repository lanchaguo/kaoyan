'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Direction = sequelize.define('Direction', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  major_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, comment: '专业ID' },
  name: { type: DataTypes.STRING(200), allowNull: false, comment: '研究方向名称' },
  code: { type: DataTypes.STRING(20), allowNull: false, comment: '方向代码' },
  year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2026, comment: '数据年份' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0, comment: '排序' },
  status: { type: DataTypes.TINYINT, defaultValue: 1, comment: '状态' }
}, {
  tableName: 'ky_direction',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['major_id', 'code', 'year'] },
    { fields: ['major_id'] },
    { fields: ['year'] }
  ]
})

module.exports = Direction
