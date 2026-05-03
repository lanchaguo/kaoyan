/**
 * 使用 MathJax(texsvg) 渲染数学公式为 SVG 图片
 * 后端预处理，前端用 <img> 显示（rich-text 支持 <img>）
 * SVG 转为 base64 data URI，无需外部 CSS 或文件
 */

const texsvg = require('texsvg')

// 简单内存缓存：公式文本 → SVG HTML（<img> 标签）
const svgCache = new Map()
const MAX_CACHE_SIZE = 500

/**
 * 将单个 LaTeX 公式转为 <img> HTML（带 base64 SVG）
 */
async function formulaToImg(formula, isBlock) {
  if (svgCache.has(formula)) {
    return svgCache.get(formula)
  }

  const svgString = await texsvg(formula.trim(), { optimize: true })

  // 提取 viewBox 计算尺寸
  const vbMatch = svgString.match(/viewBox="([^"]*)"/)
  let w = 120, h = 40
  if (vbMatch) {
    const parts = vbMatch[1].split(' ').map(Number)
    w = Math.min(Math.ceil(parts[2] / 10), 320)
    h = Math.ceil(parts[3] / 10)
  }

  const base64 = Buffer.from(svgString).toString('base64')
  const dataUri = 'data:image/svg+xml;base64,' + base64
  const display = isBlock ? 'display:block;margin:0.3em auto' : 'display:inline-block;vertical-align:middle'
  const imgHtml = '<img src="' + dataUri + '" style="' + display + ';max-width:100%;height:auto;" width="' + w + '" height="' + h + '" alt="' + formula.replace(/"/g, '&quot;') + '" />'

  if (svgCache.size >= MAX_CACHE_SIZE) {
    const keys = Array.from(svgCache.keys())
    for (let i = 0; i < Math.ceil(keys.length / 2); i++) {
      svgCache.delete(keys[i])
    }
  }
  svgCache.set(formula, imgHtml)
  return imgHtml
}

/**
 * 渲染包含 TeX 公式的文本为 HTML（公式替换为 <img>）
 * 支持：行内公式 $...$，展示公式 $$...$$
 */
async function renderMathToSvgHtml(text) {
  if (!text) return ''

  // 保护非公式的 $ 符号（如 $100）
  let processed = text.replace(/(\d+)\$/g, '$1__DOLLAR__')

  // 收集所有需要替换的公式
  const replacements = []  // { type: 'inline'|'display', formula, placeholder }

  // 展示公式 $$...$$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, function(match, formula) {
    const placeholder = '%%SVG_' + replacements.length + '%%'
    replacements.push({ type: 'display', formula: formula.trim(), placeholder })
    return placeholder
  })

  // 行内公式 $...$
  processed = processed.replace(/\$([^\$\n]+?)\$/g, function(match, formula) {
    const placeholder = '%%SVG_' + replacements.length + '%%'
    replacements.push({ type: 'inline', formula: formula.trim(), placeholder })
    return placeholder
  })

  // 并发渲染所有公式
  await Promise.all(replacements.map(async (item) => {
    try {
      item.html = await formulaToImg(item.formula, item.type === 'display')
    } catch (e) {
      item.html = '<span style="color:red;font-size:0.9em">[公式渲染失败: ' + item.formula.substring(0, 20) + ']</span>'
    }
  }))

  // 替换占位符
  for (const item of replacements) {
    processed = processed.replace(item.placeholder, item.html)
  }

  // 还原被保护的 $
  processed = processed.replace(/__DOLLAR__/g, '$')

  // 处理换行
  processed = processed.replace(/\n/g, '<br>')

  return processed
}

module.exports = {
  renderMathToSvgHtml
}
