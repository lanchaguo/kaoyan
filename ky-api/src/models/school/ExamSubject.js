'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const ExamSubject = sequelize.define('ExamSubject', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  direction_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, comment: '方向ID' },
  subject_order: { type: DataTypes.TINYINT, allowNull: false, comment: '科目序号(1-4)' },
  subject_name: { type: DataTypes.STRING(100), allowNull: false, comment: '科目名称' },
  subject_code: { type: DataTypes.STRING(20), allowNull: false, comment: '科目代码' },
  year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2026, comment: '数据年份' }
}, {
  tableName: 'ky_exam_subject',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['direction_id', 'subject_order', 'year'] },
    { fields: ['direction_id'] },
    { fields: ['year'] }
  ]
})

module.exports = ExamSubject
