'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  subject_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  difficulty_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 1 },
  stem: { type: DataTypes.TEXT, allowNull: false },
  analysis: { type: DataTypes.TEXT },
  answer: { type: DataTypes.TEXT },
  score: { type: DataTypes.DECIMAL(5,2), defaultValue: 2.00 },
  year: { type: DataTypes.INTEGER, defaultValue: 0 },
  source: { type: DataTypes.STRING(100), defaultValue: '' },
  is_official: { type: DataTypes.TINYINT, defaultValue: 1 },
  exam_session: { type: DataTypes.STRING(10), defaultValue: '初试' },
  frequency: { type: DataTypes.INTEGER, defaultValue: 0 },
  correct_rate: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'ky_question', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })

module.exports = Question
