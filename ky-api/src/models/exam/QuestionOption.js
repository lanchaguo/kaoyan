'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const QuestionOption = sequelize.define('QuestionOption', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  option_key: { type: DataTypes.STRING(5), allowNull: false },
  option_value: { type: DataTypes.TEXT, allowNull: false },
  is_correct: { type: DataTypes.TINYINT, defaultValue: 0 },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'ky_question_option', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = QuestionOption
