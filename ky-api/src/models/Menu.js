'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    comment: '父菜单ID，0为顶级'
  },
  menu_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '菜单名称'
  },
  menu_type: {
    type: DataTypes.CHAR(1),
    defaultValue: 'M',
    comment: '菜单类型 M目录 C菜单 F按钮'
  },
  path: {
    type: DataTypes.STRING(200),
    comment: '路由地址'
  },
  component: {
    type: DataTypes.STRING(255),
    comment: '组件路径'
  },
  perms: {
    type: DataTypes.STRING(100),
    comment: '权限标识'
  },
  icon: {
    type: DataTypes.STRING(100),
    comment: '菜单图标'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '显示顺序'
  },
  visible: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '是否显示 1显示 0隐藏'
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
  tableName: 'sys_menu',
  comment: '系统菜单表'
})

module.exports = Menu
