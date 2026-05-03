'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const WrongQuestion = sequelize.define('WrongQuestion', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  wrong_reason: { type: DataTypes.TEXT },
  review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_review_at: { type: DataTypes.DATE, allowNull: true },
  next_review_at: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'ky_wrong_question', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })

module.exports = WrongQuestion
