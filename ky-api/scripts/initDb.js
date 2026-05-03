'use strict'
require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    charset: 'utf8mb4'
  })

  console.log('✅ 数据库连接成功')

  const rawSql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf8')
  // 去掉注释行再分割
  const cleanSql = rawSql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  let success = 0
  let skip = 0
  for (const stmt of statements) {
    try {
      await conn.query(stmt)
      success++
    } catch (e) {
      if (e.code === 'ER_TABLE_EXISTS_ERROR' || e.code === 'ER_DUP_ENTRY') {
        skip++
      } else {
        console.warn(`⚠️  执行失败: ${stmt.substring(0, 80)}...`, e.message)
      }
    }
  }

  console.log(`✅ 初始化完成：执行 ${success} 条，跳过 ${skip} 条`)
  await conn.end()
}

init().catch(e => { console.error('❌ 初始化失败：', e.message); process.exit(1) })
