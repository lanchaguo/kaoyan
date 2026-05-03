'use strict'
/**
 * 院校模块数据导入脚本 - 优化版（批量插入）
 * 从 CSV 文件导入完整院校层级数据
 * 用法: node scripts/importSchoolData.js
 */

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { sequelize } = require('../src/config/db')
const { Province, School, Institute, Major, Direction, ExamSubject } = require('../src/models/schoolModels')
const iconv = require('iconv-lite')

// CSV 文件路径
const CSV_PATH = path.join(__dirname, '../../data/研招网所有方向及考试科目信息0306.csv')

// 解析 CSV 行
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

// 解析 CSV 文件
function parseCSV(filePath) {
  const buffer = fs.readFileSync(filePath)
  const content = iconv.decode(buffer, 'gbk')
  const lines = content.split('\n').filter(line => line.trim())
  const headers = parseCSVLine(lines[0])
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] || ''
    })
    rows.push(row)
  }

  return rows
}

// 提取科目代码和名称
function parseSubject(subjectStr) {
  if (!subjectStr || subjectStr.trim() === '') return null

  const str = subjectStr.trim()
  const match = str.match(/^(.+?)\s+(\d{3})$/)
  if (match) {
    return { name: match[1], code: match[2] }
  }
  return { name: str, code: '000' }
}

// 批量插入（自动分批）
async function bulkInsert(model, dataArray, transaction) {
  if (!dataArray || dataArray.length === 0) return 0

  const BATCH_SIZE = 500
  let inserted = 0

  for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
    const batch = dataArray.slice(i, i + BATCH_SIZE)
    try {
      await model.bulkCreate(batch, {
        ignoreDuplicates: true,
        transaction
      })
      inserted += batch.length
    } catch (err) {
      console.error(`   批量插入错误 (${i}-${i + batch.length}):`, err.message)
    }
  }

  return inserted
}

async function main() {
  console.log('='.repeat(60))
  console.log('院校模块数据导入（批量优化版）')
  console.log('='.repeat(60))

  const startTime = Date.now()

  try {
    // 1. 测试数据库连接
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')

    // 2. 解析 CSV
    console.log('\n📂 读取 CSV 文件...')
    if (!fs.existsSync(CSV_PATH)) {
      console.error(`❌ CSV 文件不存在: ${CSV_PATH}`)
      process.exit(1)
    }

    const rows = parseCSV(CSV_PATH)
    console.log(`✅ 成功读取 ${rows.length} 条数据`)

    // 3. 省市映射
    console.log('\n🔄 建立省市映射...')
    const provinceRecords = await Province.findAll({ where: { year: 2026 } })
    const provinceMap = new Map()
    provinceRecords.forEach(p => {
      provinceMap.set(p.name, p.code)
      // 简化匹配
      const shortName = p.name.replace(/市$|省$|自治区$|特别行政区$/, '')
      provinceMap.set(shortName, p.code)
    })
    console.log(`   已加载 ${provinceMap.size} 个省市`)

    // 4. 收集所有数据
    console.log('\n🔄 分析数据层级...')

    const schools = new Map()      // code -> data
    const institutes = new Map()    // key -> data
    const majors = new Map()       // key -> data
    const directions = new Map()    // key -> data
    const subjects = []            // 科目数组

    for (const row of rows) {
      const {
        '地区': region,
        '学校': schoolName,
        '学校code': schoolCode,
        '学院': instituteName,
        '学院code': instituteCode,
        '专业': majorName,
        '专业code': majorCode,
        '方向': directionName,
        '方向code': directionCode,
        '科目1': subject1,
        '科目2': subject2,
        '科目3': subject3,
        '科目4': subject4
      } = row

      if (!schoolCode || !majorCode || !directionName) continue

      // 院校
      if (!schools.has(schoolCode)) {
        // 匹配省市
        let province_code = ''
        for (const [name, code] of provinceMap) {
          if (region && region.includes(name)) {
            province_code = code
            break
          }
        }
        schools.set(schoolCode, {
          name: schoolName,
          code: schoolCode,
          province_code,
          year: 2026,
          sort: schools.size + 1,
          status: 1
        })
      }

      // 学院
      const instituteKey = `${schoolCode}|${instituteCode}`
      if (!institutes.has(instituteKey)) {
        institutes.set(instituteKey, {
          name: instituteName,
          code: instituteCode,
          school_code: schoolCode,
          sort: institutes.size + 1,
          status: 1
        })
      }

      // 专业
      const majorKey = `${instituteKey}|${majorCode}`
      if (!majors.has(majorKey)) {
        majors.set(majorKey, {
          name: majorName,
          code: majorCode,
          institute_key: instituteKey,
          sort: majors.size + 1,
          status: 1
        })
      }

      // 方向
      const directionKey = `${majorKey}|${directionCode}`
      if (!directions.has(directionKey)) {
        directions.set(directionKey, {
          name: directionName,
          code: directionCode,
          major_key: majorKey,
          sort: directions.size + 1,
          status: 1
        })
      }

      // 科目
      const subjectsList = [
        { str: subject1, order: 1 },
        { str: subject2, order: 2 },
        { str: subject3, order: 3 },
        { str: subject4, order: 4 }
      ].filter(s => s.str && s.str.trim())

      subjectsList.forEach(({ str, order }) => {
        const subj = parseSubject(str)
        subjects.push({
          direction_key: directionKey,
          order,
          name: subj.name,
          code: subj.code
        })
      })
    }

    console.log(`   数据统计:`)
    console.log(`   - 院校: ${schools.size}`)
    console.log(`   - 学院: ${institutes.size}`)
    console.log(`   - 专业: ${majors.size}`)
    console.log(`   - 方向: ${directions.size}`)
    console.log(`   - 科目: ${subjects.length}`)

    // 5. 开始事务导入
    const t = await sequelize.transaction()
    console.log('\n📥 开始批量导入...')

    try {
      // 院校
      console.log('\n  📦 导入院校...')
      const schoolData = [...schools.values()]
      await bulkInsert(School, schoolData, t)
      console.log(`     ✅ 院校导入完成: ${schoolData.length}`)

      // 获取院校 ID 映射
      const schoolRecords = await School.findAll({ where: { year: 2026 }, transaction: t })
      const schoolIdMap = new Map(schoolRecords.map(s => [s.code, s.id]))

      // 学院
      console.log('\n  📦 导入学院...')
      const instituteData = [...institutes.values()].map(inst => ({
        name: inst.name,
        code: inst.code,
        school_id: schoolIdMap.get(inst.school_code) || 0,
        sort: inst.sort,
        status: inst.status
      })).filter(i => i.school_id > 0)
      await bulkInsert(Institute, instituteData, t)
      console.log(`     ✅ 学院导入完成: ${instituteData.length}`)

      // 获取学院 ID 映射
      const allInstitutes = await Institute.findAll({
        where: { school_id: [...schoolIdMap.values()] },
        transaction: t
      })
      const instituteIdMap = new Map(allInstitutes.map(i => [`${i.school_id}|${i.code}`, i.id]))

      // 专业
      console.log('\n  📦 导入专业...')
      const majorData = [...majors.values()].map(m => {
        const instKey = m.institute_key
        const [schoolCode, instCode] = instKey.split('|')
        const schoolId = schoolIdMap.get(schoolCode)
        const instituteId = instituteIdMap.get(`${schoolId}|${instCode}`)
        return {
          name: m.name,
          code: m.code,
          institute_id: instituteId || 0,
          sort: m.sort,
          status: m.status
        }
      }).filter(m => m.institute_id > 0)
      await bulkInsert(Major, majorData, t)
      console.log(`     ✅ 专业导入完成: ${majorData.length}`)

      // 获取专业 ID 映射
      const allMajors = await Major.findAll({
        where: { institute_id: [...instituteIdMap.values()] },
        transaction: t
      })
      const majorIdMap = new Map(allMajors.map(m => [`${m.institute_id}|${m.code}`, m.id]))

      // 方向
      console.log('\n  📦 导入方向...')
      const directionData = [...directions.values()].map(d => {
        const majorKey = d.major_key
        const [schoolCode, instCode, majorCode] = majorKey.split('|')
        const schoolId = schoolIdMap.get(schoolCode)
        const instituteId = instituteIdMap.get(`${schoolId}|${instCode}`)
        const majorId = majorIdMap.get(`${instituteId}|${majorCode}`)
        return {
          name: d.name,
          code: d.code,
          major_id: majorId || 0,
          year: 2026,
          sort: d.sort,
          status: d.status
        }
      }).filter(d => d.major_id > 0)
      await bulkInsert(Direction, directionData, t)
      console.log(`     ✅ 方向导入完成: ${directionData.length}`)

      // 获取方向 ID 映射
      const allDirections = await Direction.findAll({
        where: { major_id: [...majorIdMap.values()], year: 2026 },
        transaction: t
      })
      const directionIdMap = new Map(allDirections.map(d => [`${d.major_id}|${d.code}`, d.id]))

      // 科目
      console.log('\n  📦 导入考试科目...')
      const subjectData = subjects.map(s => {
        const dirKey = s.direction_key
        const parts = dirKey.split('|')
        const schoolCode = parts[0]
        const instCode = parts[1]
        const majorCode = parts[2]
        const dirCode = parts[3]
        const schoolId = schoolIdMap.get(schoolCode)
        const instituteId = instituteIdMap.get(`${schoolId}|${instCode}`)
        const majorId = majorIdMap.get(`${instituteId}|${majorCode}`)
        const directionId = directionIdMap.get(`${majorId}|${dirCode}`)
        return {
          direction_id: directionId || 0,
          subject_order: s.order,
          subject_name: s.name,
          subject_code: s.code,
          year: 2026
        }
      }).filter(s => s.direction_id > 0)
      await bulkInsert(ExamSubject, subjectData, t)
      console.log(`     ✅ 科目导入完成: ${subjectData.length}`)

      await t.commit()
      console.log('\n✅ 数据导入完成！')

    } catch (err) {
      await t.rollback()
      throw err
    }

    // 6. 统计验证
    console.log('\n📊 最终数据统计:')
    console.log(`   院校总数: ${await School.count({ where: { year: 2026 } })}`)
    console.log(`   学院总数: ${await Institute.count()}`)
    console.log(`   专业总数: ${await Major.count()}`)
    console.log(`   方向总数: ${await Direction.count({ where: { year: 2026 } })}`)
    console.log(`   科目总数: ${await ExamSubject.count({ where: { year: 2026 } })}`)

    const cost = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n⏱️ 耗时: ${cost} 秒`)

    console.log('\n' + '='.repeat(60))
    console.log('✅ 导入完成！')
    console.log('='.repeat(60))

  } catch (err) {
    console.error('\n❌ 导入失败:', err.message)
    console.error(err)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

main()
