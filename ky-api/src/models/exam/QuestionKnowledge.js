'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const QuestionKnowledge = sequelize.define('QuestionKnowledge', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  knowledge_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, { tableName: 'ky_question_knowledge', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = QuestionKnowledge
