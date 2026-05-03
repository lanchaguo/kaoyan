'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Difficulty = sequelize.define('Difficulty', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(20), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  score_ratio: { type: DataTypes.DECIMAL(3,2), defaultValue: 1.00 },
  color: { type: DataTypes.STRING(20), defaultValue: '#67c23a' }
}, { tableName: 'ky_difficulty', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = Difficulty
