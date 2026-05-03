const { School, Institute, Major, MajorSubject, Direction, ExamSubject, getSubject } = require('../models/schoolModels')
const { Subject } = require('../models/examModels')

class TargetController {
  // 获取学校列表
  async getSchools(ctx) {
    const { keyword, rank, page = 1, pageSize = 20 } = ctx.query
    
    const { Op } = require('sequelize')
    const where = {}
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` }
    }
    if (rank) {
      where.rank = rank
    }
    
    const { rows, count } = await School.findAndCountAll({
      where,
      order: [['is_top', 'DESC'], ['sort', 'ASC'], ['id', 'ASC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    })
    
    ctx.success({ list: rows, total: count })
  }
  
  // 获取学院列表
  async getInstitutes(ctx) {
    const { school_id } = ctx.query
    
    const where = {}
    if (school_id) {
      where.school_id = school_id
    }
    
    const rows = await Institute.findAll({
      where,
      include: [{
        model: School,
        as: 'school',
        attributes: ['id', 'name']
      }],
      order: [['sort', 'ASC'], ['id', 'ASC']]
    })
    
    ctx.success(rows)
  }
  
  // 获取专业列表
  async getMajors(ctx) {
    const { institute_id, keyword, degree, page = 1, pageSize = 50 } = ctx.query
    
    const { Op } = require('sequelize')
    const where = { status: 1 }
    if (institute_id) {
      where.institute_id = institute_id
    }
    if (degree) {
      where.degree = degree
    }
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` }
    }
    
    const { rows, count } = await Major.findAndCountAll({
      where,
      include: [{
        model: Institute,
        as: 'institute',
        attributes: ['id', 'name'],
        include: [{
          model: School,
          as: 'school',
          attributes: ['id', 'name']
        }]
      }],
      order: [['sort', 'ASC'], ['id', 'ASC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    })
    
    ctx.success({ list: rows, total: count })
  }
  
  // 获取专业下的方向列表
  async getDirections(ctx) {
    const { major_id } = ctx.query
    
    if (!major_id) {
      return ctx.fail('请选择专业')
    }
    
    const directions = await Direction.findAll({
      where: { major_id, status: 1 },
      order: [['sort', 'ASC'], ['code', 'ASC']]
    })
    
    ctx.success(directions)
  }
  
  // 获取方向的考试科目
  async getDirectionSubjects(ctx) {
    const { direction_id } = ctx.query
    
    if (!direction_id) {
      return ctx.fail('请选择方向')
    }
    
    // 获取方向信息
    const direction = await Direction.findByPk(direction_id, {
      include: [{
        model: Major,
        as: 'major',
        attributes: ['id', 'name', 'code', 'degree'],
        include: [{
          model: Institute,
          as: 'institute',
          attributes: ['id', 'name'],
          include: [{
            model: School,
            as: 'school',
            attributes: ['id', 'name', 'rank']
          }]
        }]
      }]
    })
    
    if (!direction) {
      return ctx.fail('方向不存在')
    }
    
    // 获取该方向的考试科目
    const examSubjects = await ExamSubject.findAll({
      where: { direction_id, year: 2026 },
      order: [['subject_order', 'ASC']]
    })
    
    // 映射考试科目名称到学科ID（用于查询题目）
    // 注意：这些都是 ky_subject 表的 ID，用于查询题目
    const getSubjectId = (name) => {
      if (!name) return null
      // 政治类 -> ID:17 (思想政治)
      if (name.includes('政治') || name.includes('马克思') || name.includes('思政')) return 17
      // 英语一 -> ID:14
      if (name.includes('英语（一）') || name.includes('英语一') || name.includes('201')) return 14
      // 英语二 -> ID:15
      if (name.includes('英语（二）') || name.includes('英语二') || name.includes('204')) return 15
      // 英语（通用）-> ID:14 (默认英语一)
      if (name.includes('英语') && !name.includes('（）') && !name.includes('一') && !name.includes('二')) return 14
      // 数学三 -> ID:16
      if (name.includes('数学三') || name.includes('数学（三）') || name.includes('303')) return 16
      // 数学一 -> ID:18
      if (name.includes('数学一') || name.includes('数学（一）') || name.includes('301')) return 18
      // 数学二 -> ID:19
      if (name.includes('数学二') || name.includes('数学（二）') || name.includes('302')) return 19
      // 数学（通用）-> ID:18 (默认数学一)
      if (name.includes('数学')) return 18
      // 教育学 -> ID:5 (教育学)
      if (name.includes('教育学')) return 5
      // 计算机/专业课 -> ID:6 (计算机基础)
      if (name.includes('计算机') || name.includes('专业课') || name.includes('专业基础')) return 6
      return null
    }
    
    ctx.success({
      direction: {
        id: direction.id,
        name: direction.name,
        code: direction.code
      },
      major: direction.major ? {
        id: direction.major.id,
        name: direction.major.name,
        code: direction.major.code,
        degree: direction.major.degree
      } : null,
      school: direction.major && direction.major.institute && direction.major.institute.school ? {
        id: direction.major.institute.school.id,
        name: direction.major.institute.school.name,
        rank: direction.major.institute.school.rank
      } : null,
      institute: direction.major && direction.major.institute ? {
        id: direction.major.institute.id,
        name: direction.major.institute.name
      } : null,
      subjects: examSubjects.map(es => ({
        id: es.id,
        order: es.subject_order,
        name: es.subject_name,
        code: es.subject_code,
        // 学科ID用于查询题目
        subject_id: getSubjectId(es.subject_name)
      }))
    })
  }
  
  // 获取专业的考试科目
  async getMajorSubjects(ctx) {
    const { major_id } = ctx.query
    
    if (!major_id) {
      return ctx.fail('请选择专业')
    }
    
    const Subject = getSubject()
    
    // 构建 include
    const include = []
    if (Subject) {
      include.push({
        model: Subject,
        as: 'subject',
        attributes: ['id', 'name', 'code', 'color', 'icon']
      })
    }
    
    // 通过关联表获取科目
    const majorSubjects = await MajorSubject.findAll({
      where: { major_id },
      include: include,
      order: [['exam_order', 'ASC']]
    })
    
    // 同时返回专业信息
    const major = await Major.findByPk(major_id, {
      include: [{
        model: Institute,
        as: 'institute',
        attributes: ['id', 'name'],
        include: [{
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'rank']
        }]
      }]
    })
    
    ctx.success({
      major: major,
      subjects: majorSubjects.map(ms => ({
        id: ms.subject ? ms.subject.id : null,
        name: ms.subject ? ms.subject.name : '未知',
        code: ms.subject ? ms.subject.code : '',
        color: ms.subject ? ms.subject.color : '#409EFF',
        icon: ms.subject ? ms.subject.icon : '',
        exam_order: ms.exam_order,
        is_mandatory: ms.is_mandatory,
        score_range: ms.score_range
      }))
    })
  }
  
  // 保存用户目标（公开接口，无需登录）
  async saveTarget(ctx) {
    const { school_id, institute_id, major_id, direction_id } = ctx.request.body
    
    if (!school_id || !institute_id || !major_id) {
      return ctx.fail('请完整选择学校、学院和专业')
    }
    
    // 验证数据存在
    const school = await School.findByPk(school_id)
    const institute = await Institute.findByPk(institute_id)
    const major = await Major.findByPk(major_id)
    
    if (!school || !institute || !major) {
      return ctx.fail('选择的院校专业不存在')
    }
    
    // 方向信息（可选）
    let direction = null
    let subjects = []
    
    // 学科ID映射函数（用于查询题目，返回 ky_subject 表的 ID）
    const getSubjectId = (name) => {
      if (!name) return null
      // 政治类 -> ID:17 (思想政治)
      if (name.includes('政治') || name.includes('马克思') || name.includes('思政')) return 17
      // 英语一 -> ID:14
      if (name.includes('英语（一）') || name.includes('英语一') || name.includes('201')) return 14
      // 英语二 -> ID:15
      if (name.includes('英语（二）') || name.includes('英语二') || name.includes('204')) return 15
      // 英语（通用）-> ID:14
      if (name.includes('英语') && !name.includes('（）') && !name.includes('一') && !name.includes('二')) return 14
      // 数学三 -> ID:16
      if (name.includes('数学三') || name.includes('数学（三）') || name.includes('303')) return 16
      // 数学一 -> ID:18
      if (name.includes('数学一') || name.includes('数学（一）') || name.includes('301')) return 18
      // 数学二 -> ID:19
      if (name.includes('数学二') || name.includes('数学（二）') || name.includes('302')) return 19
      // 数学（通用）-> ID:18
      if (name.includes('数学')) return 18
      // 教育学 -> ID:5
      if (name.includes('教育学')) return 5
      // 计算机/专业课 -> ID:6
      if (name.includes('计算机') || name.includes('专业课') || name.includes('专业基础')) return 6
      return null
    }
    
    if (direction_id) {
      // 有方向，优先使用方向的考试科目
      direction = await Direction.findByPk(direction_id)
      if (direction) {
        const examSubjects = await ExamSubject.findAll({
          where: { direction_id, year: 2026 },
          order: [['subject_order', 'ASC']]
        })
        subjects = examSubjects.map(es => ({
          id: es.id,
          order: es.subject_order,
          name: es.subject_name,
          code: es.subject_code,
          subject_id: getSubjectId(es.subject_name)
        }))
      }
    }
    
    // 如果没有方向或方向没有科目，尝试用专业关联的科目
    if (subjects.length === 0) {
      const Subject = getSubject()
      const majorSubjects = await MajorSubject.findAll({
        where: { major_id },
        include: Subject ? [{ model: Subject, as: 'subject' }] : [],
        order: [['exam_order', 'ASC']]
      })
      subjects = majorSubjects.map(ms => ({
        id: ms.subject ? ms.subject.id : null,
        name: ms.subject ? ms.subject.name : '未知',
        code: ms.subject ? ms.subject.code : '',
        color: ms.subject ? ms.subject.color : '#409EFF',
        exam_order: ms.exam_order,
        is_mandatory: ms.is_mandatory,
        score_range: ms.score_range
      }))
    }
    
    // 返回选择结果（小程序端本地存储，无需创建用户记录）
    ctx.success({
      school: { id: school.id, name: school.name, rank: school.rank },
      institute: { id: institute.id, name: institute.name },
      major: { id: major.id, name: major.name, code: major.code, degree: major.degree },
      direction: direction ? { id: direction.id, name: direction.name, code: direction.code } : null,
      subjects: subjects
    })
  }
}

module.exports = new TargetController()
