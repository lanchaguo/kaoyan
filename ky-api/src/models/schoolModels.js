'use strict'
const sequelize = require('../config/db').sequelize

const School = require('./school/School')
const Institute = require('./school/Institute')
const Major = require('./school/Major')
const MajorSubject = require('./school/MajorSubject')
const UserTarget = require('./school/UserTarget')
const Province = require('./school/Province')
const College = require('./school/College')
const Direction = require('./school/Direction')
const ExamSubject = require('./school/ExamSubject')

// 需要关联到 exam 模块的 Subject 模型（懒加载，避免循环依赖）
let Subject
try {
  const examModels = require('./examModels')
  Subject = examModels.Subject
} catch (e) {
  Subject = null
}

// ========== 关联关系 ==========

// 省市 ↔ 学校（不创建外键约束，应用层关联）
Province.hasMany(School, { foreignKey: 'province_code', sourceKey: 'code', targetKey: 'code', as: 'schools', constraints: false })
School.belongsTo(Province, { foreignKey: 'province_code', targetKey: 'code', as: 'provinceInfo', constraints: false })

// 学校 ↔ 学院（不创建外键约束）
School.hasMany(Institute, { foreignKey: 'school_id', as: 'institutes', constraints: false })
Institute.belongsTo(School, { foreignKey: 'school_id', as: 'school', constraints: false })

// 学院 ↔ 专业（不创建外键约束）
Institute.hasMany(Major, { foreignKey: 'institute_id', as: 'majors', constraints: false })
Major.belongsTo(Institute, { foreignKey: 'institute_id', as: 'institute', constraints: false })

// 专业 ↔ 方向（不创建外键约束）
Major.hasMany(Direction, { foreignKey: 'major_id', as: 'directions', constraints: false })
Direction.belongsTo(Major, { foreignKey: 'major_id', as: 'major', constraints: false })

// 方向 ↔ 考试科目（不创建外键约束）
Direction.hasMany(ExamSubject, { foreignKey: 'direction_id', as: 'examSubjects', constraints: false })
ExamSubject.belongsTo(Direction, { foreignKey: 'direction_id', as: 'direction', constraints: false })

// 专业-科目关联（旧，兼容用，不创建外键约束）
if (Subject) {
  MajorSubject.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject', constraints: false })
  Subject.hasMany(MajorSubject, { foreignKey: 'subject_id', as: 'majorSubjects', constraints: false })
}

// ========== 旧关联（兼容小程序目标选择） ==========
// School ↔ Institute ↔ Major ↔ MajorSubject（已建立）
// UserTarget 用 School 关联

module.exports = {
  sequelize,
  School,
  Institute,
  Major,
  MajorSubject,
  UserTarget,
  Province,
  College,
  Direction,
  ExamSubject,
  getSubject: () => Subject
}
