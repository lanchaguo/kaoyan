'use strict'
require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    timezone: '+08:00',
    logging: console.log
  }
)

// 要删除的学科 ID（非 CSV 导入的）
const SUBJECT_IDS_TO_DELETE = [1, 2, 3, 4, 5, 6]

async function main() {
  console.log('=== 开始清理非 CSV 数据 ===')
  console.log('将删除学科 ID:', SUBJECT_IDS_TO_DELETE.join(', '))
  console.log('')

  // 1. 统计要删除的题目数量
  const [qCount] = await sequelize.query(
    'SELECT COUNT(*) as cnt FROM ky_question WHERE subject_id IN (?)',
    { replacements: [SUBJECT_IDS_TO_DELETE] }
  )
  console.log(`待删除题目数量: ${qCount[0].cnt} 道`)

  // 2. 获取要删除的题目 ID 列表
  const [questions] = await sequelize.query(
    'SELECT id FROM ky_question WHERE subject_id IN (?)',
    { replacements: [SUBJECT_IDS_TO_DELETE] }
  )
  const qIds = questions.map(q => q.id)
  console.log(`题目 ID 范围: ${qIds.length > 0 ? qIds[0] + ' ~ ' + qIds[qIds.length - 1] : '无'}`)

  if (qIds.length === 0) {
    console.log('没有题目需要删除，跳过。')
  } else {
    // 3. 删除题目选项
    const [optResult] = await sequelize.query(
      'DELETE FROM ky_question_option WHERE question_id IN (?)',
      { replacements: [qIds] }
    )
    console.log(`已删除题目选项`)

    // 4. 删除题目-知识点关联
    const [qkResult] = await sequelize.query(
      'DELETE FROM ky_question_knowledge WHERE question_id IN (?)',
      { replacements: [qIds] }
    )
    console.log(`已删除题目-知识点关联`)

    // 5. 删除题目
    const [qResult] = await sequelize.query(
      'DELETE FROM ky_question WHERE subject_id IN (?)',
      { replacements: [SUBJECT_IDS_TO_DELETE] }
    )
    console.log(`已删除题目`)
  }

  // 6. 删除这些学科的知识点
  const [kpResult] = await sequelize.query(
    'DELETE FROM ky_knowledge_point WHERE subject_id IN (?)',
    { replacements: [SUBJECT_IDS_TO_DELETE] }
  )
  console.log(`已删除知识点 (受影响的行: ${kpResult.affectedRows || 'N/A'})`)

  // 7. 删除学科
  const [subResult] = await sequelize.query(
    'DELETE FROM ky_subject WHERE id IN (?)',
    { replacements: [SUBJECT_IDS_TO_DELETE] }
  )
  console.log(`已删除学科 (受影响的行: ${subResult.affectedRows || 'N/A'})`)

  // 8. 验证结果
  console.log('')
  console.log('=== 清理完成，验证结果 ===')
  const [subjects] = await sequelize.query('SELECT id, name, code FROM ky_subject ORDER BY id')
  console.log('剩余学科:')
  subjects.forEach(s => {
    console.log(`  [${s.id}] ${s.name} (${s.code})`)
  })

  const [totalQ] = await sequelize.query('SELECT COUNT(*) as cnt FROM ky_question')
  console.log(`剩余题目总数: ${totalQ[0].cnt} 道`)

  await sequelize.close()
  console.log('完成！')
}

main().catch(async e => {
  console.error('清理失败:', e.message)
  await sequelize.close()
  process.exit(1)
})
