'use strict'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

class AuthController {
  // 登录
  async login(ctx) {
    const { username, password } = ctx.request.body
    if (!username || !password) {
      ctx.body = { code: 400, message: '用户名和密码不能为空' }
      return
    }

    const user = await User.findOne({ where: { username } })
    if (!user) {
      ctx.body = { code: 400, message: '用户名或密码错误' }
      return
    }

    if (user.status === 0) {
      ctx.body = { code: 403, message: '账号已被禁用' }
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      ctx.body = { code: 400, message: '用户名或密码错误' }
      return
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email
        }
      }
    }
  }

  // 获取当前用户信息
  async getUserInfo(ctx) {
    const { id } = ctx.state.user
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      ctx.body = { code: 404, message: '用户不存在' }
      return
    }
    ctx.body = { code: 200, data: user }
  }
}

module.exports = new AuthController()
