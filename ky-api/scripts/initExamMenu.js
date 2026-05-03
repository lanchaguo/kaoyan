require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  })

  const sql = fs.readFileSync('sql/exam_menu.sql', 'utf8')
  const stmts = sql.split(';').filter(s => s.trim())

  for (const stmt of stmts) {
    await conn.query(stmt)
    console.log('OK:', stmt.trim().substring(0, 70))
  }

  await conn.end()
  console.log('菜单数据写入完成')
}

main().catch(e => { console.error(e.message); process.exit(1) })
