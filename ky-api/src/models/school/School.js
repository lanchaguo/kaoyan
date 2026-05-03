'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const School = sequelize.define('School', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, comment: '学校名称' },
  code: { type: DataTypes.STRING(20), allowNull: false, comment: '学校代码' },
  province_code: { type: DataTypes.STRING(10), defaultValue: '', comment: '省市代码' },
  year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2026, comment: '数据年份' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1, comment: '状态' },
  // 以下字段保留（兼容旧数据，小程序目标选择用）
  logo: { type: DataTypes.STRING(255), defaultValue: '', comment: '校徽URL' },
  province: { type: DataTypes.STRING(50), defaultValue: '', comment: '所在省份(旧)' },
  city: { type: DataTypes.STRING(50), defaultValue: '', comment: '所在城市(旧)' },
  rank: { type: DataTypes.STRING(20), defaultValue: '', comment: '院校层次' },
  is_top: { type: DataTypes.TINYINT, defaultValue: 0, comment: '是否热门' }
}, {
  tableName: 'ky_school',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = School
