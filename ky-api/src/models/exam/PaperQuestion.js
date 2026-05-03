'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const PaperQuestion = sequelize.define('PaperQuestion', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  paper_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  sort_num: { type: DataTypes.INTEGER, defaultValue: 0 },
  score: { type: DataTypes.DECIMAL(5,2), defaultValue: 2.00 }
}, { tableName: 'ky_paper_question', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = PaperQuestion
