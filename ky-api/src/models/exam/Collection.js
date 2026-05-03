'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Collection = sequelize.define('Collection', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  note: { type: DataTypes.TEXT }
}, { tableName: 'ky_collection', timestamps: true, createdAt: 'created_at', updatedAt: false })

module.exports = Collection
