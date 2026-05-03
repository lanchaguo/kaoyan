'use strict'

/**
 * CSV 题库数据导入脚本
 * 将 data/ 目录下政治/数学/英语真题 CSV 批量导入数据库
 * 用法: node scripts/importCsvData.js
 */

require('dotenv').config()
const path = require('path')
const fs = require('fs')
const csv = require('csv-parse/sync')
const { sequelize } = require('../src/config/db')

// ===== 模型 =====
const Subject = require('../src/models/exam/Subject')
const QuestionType = require('../src/models/exam/QuestionType')
const Question = require('../src/models/exam/Question')
const QuestionOption = require('../src/models/exam/QuestionOption')
const Difficulty = require('../src/models/exam/Difficulty')

// ===== 常量配置 =====
const DATA_BASE = path.resolve(__dirname, '../../data')

// CSV 科目 → 数据库学科映射（name/code/color/sort）
const SUBJECT_MAP = {
  '考研政治': { name: '思想政治', code: '政治', color: '#e74c3c', icon: 'zhengzhi', sort: 1 },
  '英语一':   { name: '英语（一）', code: '英语一', color: '#3498db', icon: 'yingyu', sort: 2 },
  '英语二':   { name: '英语（二）', code: '英语二', color: '#2980b9', icon: 'yingyu2', sort: 3 },
  '数学一':   { name: '数学（一）', code: '数学一', color: '#e67e22', icon: 'shuxue', sort: 4 },
  '数学二':   { name: '数学（二）', code: '数学二', color: '#f39c12', icon: 'shuxue2', sort: 5 },
  '数学三':   { name: '数学（三）', code: '数学三', color: '#d35400', icon: 'shuxue3', sort: 6 },
}

// CSV 题型 → 数据库题型映射（code 对应 ky_question_type 表的 code 字段）
const TYPE_MAP = {
  '单项选择题': 'choice_single',
  '多项选择题': 'choice_multi',
  '完形填空':   'cloze',
  '填空题':     'fill',
  '简答题':     'short_answer',
  '论述题':     'essay',
  '分析题':     'analysis',
  '翻译':       'translation',
  '写作':       'writing',
  '解答题':     'calculation',
  '选择题':     'choice_single',
  '阅读理解':   'short_answer',
  '新题型':     'short_answer',
}

// 默认难度：中等
const DEFAULT_DIFFICULTY = 2

// ===== 工具函数 =====

/**
 * 解析选项字段 "A:内容 | B:内容 | C:内容"
 * 返回 [{key, value}, ...]
 */
function parseOptions(optStr) {
  if (!optStr || !optStr.trim()) return []
  return optStr.split('|').map(o => {
    const m = o.trim().match(/^([A-Za-z])\s*[:：]\s*(.+)$/)
    if (!m) return null
    return { key: m[1].toUpperCase(), value: m[2].trim() }
  }).filter(Boolean)
}

/**
 * 解析答案字段，支持 "A" / "AB" / "A、B" 等形式
 * 返回答案字母数组 ['A','B']
 */
function parseAnswerKeys(ansStr) {
  if (!ansStr || !ansStr.trim()) return []
  // 去除分隔符，提取大写字母
  return ansStr.toUpperCase().split(/[,，、\s]+/).map(s => s.trim()).filter(s => /^[A-Z]$/.test(s))
}

// 递归扫描目录下所有 CSV 文件
function scanCsvFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      results.push(...scanCsvFiles(full))
    } else if (item.endsWith('.csv')) {
      results.push(full)
    }
  }
  return results
}

// ===== 主流程 =====
async function main() {
  console.log('=== 考研真题 CSV 导入脚本 ===\n')

  // 1. 测试数据库连接
  await sequelize.authenticate()
  console.log('数据库连接成功\n')

  // 2. 查询/创建学科
  console.log('--- 同步学科数据 ---')
  const subjectCache = {}  // csvName -> Subject record
  for (const [csvName, info] of Object.entries(SUBJECT_MAP)) {
    let sub = await Subject.findOne({ where: { code: info.code } })
    if (!sub) {
      sub = await Subject.create({ ...info, status: 1 })
      console.log(`  新建学科: ${info.name} (${info.code})`)
    } else {
      console.log(`  已存在学科: ${info.name} (${info.code}) id=${sub.id}`)
    }
    subjectCache[csvName] = sub
  }

  // 3. 查询题型
  console.log('\n--- 加载题型数据 ---')
  const allTypes = await QuestionType.findAll()
  const typeCache = {}  // code -> QuestionType
  for (const t of allTypes) {
    typeCache[t.code] = t
  }
  console.log(`  已加载 ${allTypes.length} 种题型`)

  // 4. 扫描并读取所有 CSV 文件
  const csvFiles = scanCsvFiles(DATA_BASE)
  console.log(`\n--- 扫描到 ${csvFiles.length} 个 CSV 文件 ---`)

  // 5. 统计
  let totalInserted = 0
  let totalSkipped = 0
  let totalOptionInserted = 0

  // 6. 逐文件处理
  for (const filePath of csvFiles.sort()) {
    const fileName = path.basename(filePath)
    let fileRows
    try {
      const content = fs.readFileSync(filePath)
      fileRows = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        trim: true
      })
    } catch (e) {
      console.warn(`  [跳过] 解析失败: ${fileName} - ${e.message}`)
      continue
    }

    if (!fileRows || fileRows.length === 0) {
      console.warn(`  [跳过] 空文件: ${fileName}`)
      continue
    }

    // 文件级统计
    let fileInserted = 0
    let fileSkipped = 0

    for (const row of fileRows) {
      const csvSubject = (row['科目'] || '').trim()
      const csvType = (row['题型'] || '').trim()
      const stem = (row['题干'] || '').trim()
      const optStr = (row['选项'] || row['选项'] || '').trim()
      const answerRaw = (row['答案'] || '').trim()
      const analysis = (row['解析'] || '').trim()
      const yearStr = (row['年份'] || '').trim()
      const scoreStr = (row['分值'] || '').trim()

      if (!stem || !csvSubject || !csvType) {
        fileSkipped++
        continue
      }

      // 映射学科
      const subject = subjectCache[csvSubject]
      if (!subject) {
        fileSkipped++
        continue
      }

      // 映射题型
      const typeCode = TYPE_MAP[csvType]
      if (!typeCode) {
        fileSkipped++
        continue
      }
      const questionType = typeCache[typeCode]
      if (!questionType) {
        fileSkipped++
        continue
      }

      const year = parseInt(yearStr) || 0
      const score = parseFloat(scoreStr) || questionType.default_score || 2

      // 检查是否已存在（通过 stem + subject_id + year 去重）
      const existing = await Question.findOne({
        where: { subject_id: subject.id, year, stem }
      })
      if (existing) {
        fileSkipped++
        continue
      }

      // 判断是否含英语文章字段
      const articleText = row['文章'] ? (row['文章'] || '').trim() : ''
      const finalStem = articleText ? `【文章】\n${articleText}\n\n【题干】\n${stem}` : stem

      // 创建题目（使用事务保证题目+选项原子性）
      const t = await sequelize.transaction()
      try {
        const question = await Question.create({
          subject_id: subject.id,
          type_id: questionType.id,
          difficulty_id: DEFAULT_DIFFICULTY,
          stem: finalStem,
          analysis,
          answer: answerRaw,
          score,
          year,
          source: fileName.replace('.csv', ''),
          is_official: 1,
          exam_session: '初试',
          status: 1
        }, { transaction: t })

        // 插入选项（仅选择题/完形填空有选项）
        const options = parseOptions(optStr)
        if (options.length > 0) {
          const answerKeys = parseAnswerKeys(answerRaw)
          const optionRecords = options.map((opt, idx) => ({
            question_id: question.id,
            option_key: opt.key,
            option_value: opt.value,
            is_correct: answerKeys.includes(opt.key) ? 1 : 0,
            sort: idx + 1
          }))
          await QuestionOption.bulkCreate(optionRecords, { transaction: t })
          totalOptionInserted += optionRecords.length
        }

        await t.commit()
        fileInserted++
        totalInserted++
      } catch (err) {
        await t.rollback()
        console.error(`  [错误] 插入失败 ${fileName} 第${year}年 "${stem.substring(0, 30)}": ${err.message}`)
        fileSkipped++
      }
    }

    console.log(`  ${fileName}: 导入 ${fileInserted} 道, 跳过 ${fileSkipped} 道`)
    totalSkipped += fileSkipped
  }

  console.log(`\n=== 导入完成 ===`)
  console.log(`  成功导入题目: ${totalInserted} 道`)
  console.log(`  成功导入选项: ${totalOptionInserted} 条`)
  console.log(`  跳过/已存在: ${totalSkipped} 条`)

  await sequelize.close()
}

main().catch(err => {
  console.error('导入脚本执行失败:', err)
  process.exit(1)
})
