'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  icon: { type: DataTypes.STRING(100), defaultValue: '' },
  color: { type: DataTypes.STRING(20), defaultValue: '#409EFF' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'ky_subject', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })

module.exports = Subject
