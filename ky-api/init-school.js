const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function initSchool() {
  const connection = await mysql.createConnection({
    host: '101.43.125.38',
    user: 'xyl',
    password: 'TiwyWTJPDAHkzKHk',
    database: 'xyl',
    multipleStatements: true
  })

  try {
    const sqlDir = path.join(__dirname, 'sql')
    
    // 读取并执行 schema
    const schema = fs.readFileSync(path.join(sqlDir, 'school.sql'), 'utf8')
    console.log('执行 school.sql...')
    await connection.query(schema)
    console.log('表创建成功')
    
    // 读取并执行 data
    const data = fs.readFileSync(path.join(sqlDir, 'school_data.sql'), 'utf8')
    console.log('执行 school_data.sql...')
    await connection.query(data)
    console.log('数据导入成功')
    
    console.log('院校专业数据初始化完成！')
  } catch (err) {
    console.error('执行失败:', err.message)
  } finally {
    await connection.end()
  }
}

initSchool()
