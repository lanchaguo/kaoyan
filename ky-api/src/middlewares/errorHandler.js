'use strict'

const errorHandler = async (ctx, next) => {
  // 添加成功/失败辅助方法
  ctx.success = (data = null, message = '操作成功') => {
    ctx.body = {
      code: 200,
      message: message,
      data: data
    }
  }
  
  ctx.fail = (message = '操作失败', code = 400) => {
    ctx.status = code >= 100 && code < 600 ? code : 400
    ctx.body = {
      code: ctx.status,
      message: message
    }
  }
  
  try {
    await next()
  } catch (err) {
    console.error('[Error]', err)
    const status = err.status || 500
    ctx.status = status
    ctx.body = {
      code: status,
      message: err.message || '服务器内部错误'
    }
  }
}

module.exports = { errorHandler }
