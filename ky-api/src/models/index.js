'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const UserRole = sequelize.define('UserRole', {
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true },
  role_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true }
}, { tableName: 'sys_user_role', timestamps: false, id: false })

const RoleMenu = sequelize.define('RoleMenu', {
  role_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true },
  menu_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true }
}, { tableName: 'sys_role_menu', timestamps: false, id: false })

module.exports = { UserRole, RoleMenu }
