const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const UserTarget = sequelize.define('UserTarget', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '用户ID'
  },
  school_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '目标学校ID'
  },
  institute_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '目标学院ID'
  },
  major_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '目标专业ID'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 1当前 0历史'
  }
}, {
  tableName: 'ky_user_target',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '用户目标表'
})

module.exports = UserTarget
