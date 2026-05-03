'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const PracticeProgress = sequelize.define('PracticeProgress', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  subject_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  total_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  done_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  correct_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  accuracy_rate: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 }
}, { tableName: 'ky_practice_progress', timestamps: false, updatedAt: 'updated_at' })

module.exports = PracticeProgress
