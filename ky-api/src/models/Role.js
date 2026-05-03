'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '角色名称'
  },
  role_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '角色标识'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '显示顺序'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 1正常 0禁用'
  },
  remark: {
    type: DataTypes.STRING(255),
    comment: '备注'
  }
}, {
  tableName: 'sys_role',
  comment: '系统角色表'
})

module.exports = Role
