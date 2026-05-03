const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const MajorSubject = sequelize.define('MajorSubject', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  major_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '专业ID'
  },
  subject_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '学科ID'
  },
  exam_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '考试顺序'
  },
  is_mandatory: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '是否必考'
  },
  score_range: {
    type: DataTypes.STRING(50),
    defaultValue: '',
    comment: '分值范围'
  }
}, {
  tableName: 'ky_major_subject',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  comment: '专业科目关联表'
})

module.exports = MajorSubject
