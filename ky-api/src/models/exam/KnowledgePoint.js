'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const KnowledgePoint = sequelize.define('KnowledgePoint', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  subject_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  parent_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  name: { type: DataTypes.STRING(100), allowNull: false },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'ky_knowledge_point', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = KnowledgePoint
