'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const QuestionType = sequelize.define('QuestionType', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(30), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  has_option: { type: DataTypes.TINYINT, defaultValue: 0 },
  has_multi_answer: { type: DataTypes.TINYINT, defaultValue: 0 },
  default_score: { type: DataTypes.DECIMAL(5,2), defaultValue: 2.00 },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'ky_question_type', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = QuestionType
