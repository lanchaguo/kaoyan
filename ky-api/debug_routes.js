// 在 routes/index.js 的末尾加一行
const router = require('./routes')

// 打印所有注册的路由
setTimeout(() => {
  console.log('=== Registered Routes ===')
  const stack = router.stack || []
  stack.forEach((r, i) => {
    console.log(`${i}: [${r.methods.join(',')}] ${r.path}`)
  })
}, 1000)
