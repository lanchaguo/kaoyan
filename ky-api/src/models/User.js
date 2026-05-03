'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '密码(bcrypt)'
  },
  nickname: {
    type: DataTypes.STRING(50),
    comment: '昵称'
  },
  avatar: {
    type: DataTypes.STRING(255),
    comment: '头像'
  },
  email: {
    type: DataTypes.STRING(100),
    comment: '邮箱'
  },
  phone: {
    type: DataTypes.STRING(20),
    comment: '手机号'
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
  tableName: 'sys_user',
  comment: '系统用户表'
})

module.exports = User
