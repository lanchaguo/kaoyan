'use strict'
require('dotenv').config()

const Koa = require('koa')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')
const helmet = require('koa-helmet')
const router = require('./routes')
const { errorHandler } = require('./middlewares/errorHandler')
const { sequelize } = require('./config/db')

const app = new Koa()
const PORT = process.env.PORT || 3000

// 中间件
app.use(helmet())
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))
app.use(koaBody())
app.use(errorHandler)

// 路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动
const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    // await sequelize.sync({ alter: true }) // 开发时可开启自动同步
    app.listen(PORT, () => {
      console.log(`🚀 ky-api 服务启动：http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ 数据库连接失败：', err)
    process.exit(1)
  }
}

start()
