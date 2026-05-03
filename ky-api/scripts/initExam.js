const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  })

  const conn = await pool.getConnection()

  try {
    // 执行建表 SQL
    const tableSql = fs.readFileSync(path.join(__dirname, '../sql/exam.sql'), 'utf8')
    const tableStatements = tableSql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    console.log(`执行 ${tableStatements.length} 条建表语句...`)
    for (const stmt of tableStatements) {
      await conn.query(stmt)
      console.log('✓', stmt.substring(0, 60))
    }

    // 执行数据 SQL（用 INSERT IGNORE 避免重复插入）
    const dataRaw = fs.readFileSync(path.join(__dirname, '../sql/exam_data.sql'), 'utf8')
    const dataNoComments = dataRaw
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
    const dataNoInsert = dataNoComments.replace(/INSERT INTO/g, 'INSERT IGNORE INTO')
    const dataStatements = dataNoInsert
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    console.log(`\n执行 ${dataStatements.length} 条数据语句...`)
    for (const stmt of dataStatements) {
      await conn.query(stmt)
      console.log('✓', stmt.substring(0, 70))
    }

    // 验证数据
    const [[subjects], [types], [diffs], [questions]] = await Promise.all([
      conn.query('SELECT COUNT(*) as c FROM ky_subject'),
      conn.query('SELECT COUNT(*) as c FROM ky_question_type'),
      conn.query('SELECT COUNT(*) as c FROM ky_difficulty'),
      conn.query('SELECT COUNT(*) as c FROM ky_question')
    ])

    console.log(`\n✅ 完成！`)
    console.log(`  学科：${subjects[0].c} 条`)
    console.log(`  题型：${types[0].c} 条`)
    console.log(`  难度：${diffs[0].c} 条`)
    console.log(`  题目：${questions[0].c} 条`)

  } finally {
    conn.release()
    await pool.end()
  }
}

main().catch(e => { console.error('错误:', e.message); process.exit(1) })
