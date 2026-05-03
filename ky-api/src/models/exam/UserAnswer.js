'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const UserAnswer = sequelize.define('UserAnswer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  answer: { type: DataTypes.TEXT },
  is_correct: { type: DataTypes.TINYINT, defaultValue: 0 },
  score: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
  time_spent: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'ky_user_answer', timestamps: true, createdAt: 'answered_at', updatedAt: false })

module.exports = UserAnswer
