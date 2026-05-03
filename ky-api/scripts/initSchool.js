'use strict'
/**
 * 院校模块数据库初始化脚本
 * 用法: node scripts/initSchool.js
 *
 * 功能:
 * 1. 同步数据库表结构（创建表）
 * 2. 插入 31 个省市基础数据
 */

require('dotenv').config()
const { sequelize } = require('../src/config/db')
const { Province, School } = require('../src/models/schoolModels')

const PROVINCES = [
  { name: '北京市', code: '110000', sort: 1 },
  { name: '天津市', code: '120000', sort: 2 },
  { name: '河北省', code: '130000', sort: 3 },
  { name: '山西省', code: '140000', sort: 4 },
  { name: '内蒙古自治区', code: '150000', sort: 5 },
  { name: '辽宁省', code: '210000', sort: 6 },
  { name: '吉林省', code: '220000', sort: 7 },
  { name: '黑龙江省', code: '230000', sort: 8 },
  { name: '上海市', code: '310000', sort: 9 },
  { name: '江苏省', code: '320000', sort: 10 },
  { name: '浙江省', code: '330000', sort: 11 },
  { name: '安徽省', code: '340000', sort: 12 },
  { name: '福建省', code: '350000', sort: 13 },
  { name: '江西省', code: '360000', sort: 14 },
  { name: '山东省', code: '370000', sort: 15 },
  { name: '河南省', code: '410000', sort: 16 },
  { name: '湖北省', code: '420000', sort: 17 },
  { name: '湖南省', code: '430000', sort: 18 },
  { name: '广东省', code: '440000', sort: 19 },
  { name: '广西壮族自治区', code: '450000', sort: 20 },
  { name: '海南省', code: '460000', sort: 21 },
  { name: '重庆市', code: '500000', sort: 22 },
  { name: '四川省', code: '510000', sort: 23 },
  { name: '贵州省', code: '520000', sort: 24 },
  { name: '云南省', code: '530000', sort: 25 },
  { name: '西藏自治区', code: '540000', sort: 26 },
  { name: '陕西省', code: '610000', sort: 27 },
  { name: '甘肃省', code: '620000', sort: 28 },
  { name: '青海省', code: '630000', sort: 29 },
  { name: '宁夏回族自治区', code: '640000', sort: 30 },
  { name: '新疆维吾尔自治区', code: '650000', sort: 31 }
]

async function main() {
  console.log('='.repeat(50))
  console.log('院校模块数据库初始化')
  console.log('='.repeat(50))

  try {
    // 1. 测试数据库连接
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')

    // 2. 同步表结构
    console.log('\n📦 同步数据库表结构...')
    await sequelize.sync({ alter: true })
    console.log('✅ 数据库表同步完成')
    console.log('   已创建/更新的表:')
    console.log('   - ky_province (省市)')
    console.log('   - ky_school (院校)')
    console.log('   - ky_college (学院)')
    console.log('   - ky_major (专业)')
    console.log('   - ky_direction (方向)')
    console.log('   - ky_exam_subject (考试科目)')
    console.log('   - ky_institute (学院-旧)')
    console.log('   - ky_user_target (用户目标)')

    // 3. 插入省市数据
    console.log('\n📥 插入省市基础数据...')
    let createdCount = 0
    let existingCount = 0

    for (const p of PROVINCES) {
      const [province, created] = await Province.findOrCreate({
        where: { code: p.code, year: 2026 },
        defaults: {
          name: p.name,
          code: p.code,
          year: 2026,
          sort: p.sort,
          status: 1
        }
      })
      if (created) {
        createdCount++
      } else {
        existingCount++
      }
    }

    console.log(`✅ 省市数据处理完成`)
    console.log(`   新增: ${createdCount} 条`)
    console.log(`   已存在: ${existingCount} 条`)
    console.log(`   总计: ${createdCount + existingCount} 条`)

    // 4. 验证数据
    const totalProvinces = await Province.count({ where: { year: 2026 } })
    console.log(`\n📊 验证: 数据库中共有 ${totalProvinces} 条省市数据 (2026年)`)

    console.log('\n' + '='.repeat(50))
    console.log('✅ 初始化完成！')
    console.log('='.repeat(50))

  } catch (err) {
    console.error('\n❌ 初始化失败:', err.message)
    console.error(err)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

main()
