const bcrypt = require('bcryptjs')

async function main() {
  // 直接从数据库查并比对
  require('dotenv').config()
  const { sequelize } = require('../src/config/db')
  const rows = await sequelize.query(
    "SELECT password FROM sys_user WHERE username='admin'",
    { type: 'SELECT' }
  )
  if (!rows.length) {
    console.log('admin 用户不存在')
    process.exit(1)
  }
  const hash = rows[0].password
  console.log('DB hash:', hash)

  const r1 = await bcrypt.compare('admin123', hash)
  console.log('admin123 match:', r1)

  // 如果不匹配，重新生成并更新
  if (!r1) {
    console.log('\n密码不匹配，重新设置 admin123...')
    const newHash = await bcrypt.hash('admin123', 10)
    await sequelize.query(
      `UPDATE sys_user SET password='${newHash}' WHERE username='admin'`
    )
    console.log('密码已更新为 admin123')
  }

  process.exit(0)
}

main().catch(e => { console.error(e.message); process.exit(1) })
