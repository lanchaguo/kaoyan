'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const College = sequelize.define('College', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  school_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, comment: '学校ID' },
  name: { type: DataTypes.STRING(100), allowNull: false, comment: '学院名称' },
  code: { type: DataTypes.STRING(20), allowNull: false, comment: '学院代码' },
  year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2026, comment: '数据年份' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0, comment: '排序' },
  status: { type: DataTypes.TINYINT, defaultValue: 1, comment: '状态' }
}, {
  tableName: 'ky_college',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['school_id', 'code', 'year'] },
    { fields: ['school_id'] },
    { fields: ['year'] }
  ]
})

module.exports = College
