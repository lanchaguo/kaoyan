'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Paper = sequelize.define('Paper', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  subject_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  year: { type: DataTypes.INTEGER, defaultValue: 0 },
  session: { type: DataTypes.STRING(10), defaultValue: '初试' },
  total_score: { type: DataTypes.DECIMAL(5,2), defaultValue: 100.00 },
  total_time: { type: DataTypes.INTEGER, defaultValue: 180 },
  difficulty_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 1 },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'ky_paper', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })

module.exports = Paper
