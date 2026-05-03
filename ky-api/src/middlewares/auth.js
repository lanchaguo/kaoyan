'use strict'
const jwt = require('jsonwebtoken')

/**
 * JWT 认证中间件（排除白名单路由）
 */
const authMiddleware = async (ctx, next) => {
  console.log('[Auth Debug] path:', ctx.path, '| method:', ctx.method, '| has auth header:', !!ctx.headers.authorization)
  const whiteList = ['/api/auth/login', '/api/auth/register']
  if (whiteList.includes(ctx.path)) {
    return await next()
  }

  const token = ctx.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    ctx.status = 401
    ctx.body = { code: 401, message: '未携带 Token，请先登录' }
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    ctx.state.user = decoded
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { code: 401, message: 'Token 无效或已过期' }
  }
}

module.exports = authMiddleware
