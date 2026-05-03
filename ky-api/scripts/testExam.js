const path = require('path')
const base = path.join(__dirname, '..')
try {
  const r = require(path.join(base, 'src/routes/index'))
  console.log('路由加载成功')
} catch (e) {
  console.error('路由错误:', e.message)
  process.exit(1)
}

