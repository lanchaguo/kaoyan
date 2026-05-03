'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Major = sequelize.define('Major', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  institute_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, comment: '学院ID' },
  code: { type: DataTypes.STRING(20), allowNull: false, comment: '专业代码' },
  name: { type: DataTypes.STRING(100), allowNull: false, comment: '专业名称' },
  year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2026, comment: '数据年份' },
  degree: { type: DataTypes.STRING(10), defaultValue: '学术型', comment: '学位类型' },
  study_mode: { type: DataTypes.STRING(20), defaultValue: '全日制', comment: '学习方式' },
  is_allow_cross: { type: DataTypes.TINYINT, defaultValue: 1, comment: '是否允许跨考' },
  enrollment_count: { type: DataTypes.INTEGER, defaultValue: 0, comment: '招生人数' },
  exam_subject_codes: { type: DataTypes.STRING(200), defaultValue: '', comment: '考试科目代码(旧)' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1, comment: '状态' }
}, {
  tableName: 'ky_major',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Major
