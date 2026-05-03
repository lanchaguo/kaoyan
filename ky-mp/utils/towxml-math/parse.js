/**
 * towxml-math: 前端 KaTeX 数学公式渲染
 * 依赖 katex-min.js（压缩版 KaTeX 内核）
 */
var katex = require('./katex-min.js')

// 块级公式 $$...$$
var blockMath = /\$\$([\s\S]*?)\$\$/g
// 行内公式 $...$，排除以 \ 转义的 \$ 和数字后紧跟 $ 的情况
var inlineMath = /(^|[^\\])\$([^\n$]+?)\$(?=[^0-9a-zA-Z]|$)/g

function renderMath(latex, displayMode) {
  try {
    return katex.renderToString(latex, {
      displayMode: !!displayMode,
      throwOnError: false,
      strict: 'ignore'
    })
  } catch (e) {
    return '<span style="color:#cc0000;">[公式错误]</span>'
  }
}

function replaceMath(str) {
  if (!str || typeof str !== 'string') return str
  // 保护非公式的 $ 符号（如 $100, $ US）
  str = str.replace(/(\d+)\$/g, '$1__DOLLAR__')
  // 块级公式 $$...$$
  str = str.replace(blockMath, function (match, formula) {
    return renderMath(formula.trim(), true)
  })
  // 行内公式 $...$
  str = str.replace(inlineMath, function (match, prefix, formula) {
    return prefix + renderMath(formula.trim(), false)
  })
  // 恢复被保护的 $
  str = str.replace(/__DOLLAR__/g, '$')
  // 恢复转义的 \$
  str = str.replace(/\\\$/g, '$')
  return str
}

module.exports = function (content, options) {
  if (!content || typeof content !== 'string') return content
  if (options && options.math) {
    return replaceMath(content)
  }
  return content
}
