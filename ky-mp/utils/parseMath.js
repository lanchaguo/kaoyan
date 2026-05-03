/**
 * 将包含 TeX 数学公式的文本转换为 HTML（用于 rich-text 渲染）
 * 支持：行内公式 $...$，展示公式 $$...$$，常见符号
 */
function parseMathToHtml(text) {
  if (!text) return ''

  // 1. 先用占位符把 $$...$$ 和 $...$  formula 保护起来
  const placeholders = []
  let idx = 0

  // 展示公式 $$...$$（优先）
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, function(match, formula) {
    const html = renderFormula(formula.trim(), true)
    const ph = '__MATH_PLACEHOLDER_' + (idx++) + '__'
    placeholders.push({ ph, html })
    return ph
  })

  // 行内公式 $...$
  text = text.replace(/\$([^\$\n]+?)\$/g, function(match, formula) {
    const html = renderFormula(formula.trim(), false)
    const ph = '__MATH_PLACEHOLDER_' + (idx++) + '__'
    placeholders.push({ ph, html })
    return ph
  })

  // 2. 普通文本做基础 HTML 转义
  text = escapeHtml(text)

  // 3. 换行符转 <br>
  text = text.replace(/\n/g, '<br>')

  // 4. 还原占位符为渲染好的 HTML
  placeholders.forEach(function(item) {
    text = text.replace(item.ph, item.html)
  })

  return text
}

/** 渲染单条公式为 HTML（简化实现，覆盖考研常见公式） */
function renderFormula(tex, isDisplay) {
  var html = tex

  // 希腊字母
  var greek = {
    'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
    'epsilon': 'ε', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
    'pi': 'π', 'sigma': 'σ', 'phi': 'φ', 'omega': 'ω',
    'Gamma': 'Γ', 'Delta': 'Δ', 'Theta': 'Θ', 'Lambda': 'Λ',
    'Pi': 'Π', 'Sigma': 'Σ', 'Phi': 'Φ', 'Omega': 'Ω'
  }
  Object.keys(greek).forEach(function(key) {
    html = html.replace(new RegExp('\\\\' + key, 'g'), greek[key])
  })

  // 上标 ^ {...} 或 ^ 单个字符
  html = html.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
  html = html.replace(/\^(\S)/g, '<sup>$1</sup>')

  // 下标 _{...} 或 _ 单个字符
  html = html.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
  html = html.replace(/_(\S)/g, '<sub>$1</sub>')

  // 分数 \frac{分子}{分母}
  html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,
    '<span class="math-frac"><span class="math-num">$1</span><span class="math-frac-line"></span><span class="math-den">$2</span></span>')

  // 根号 \sqrt[次数]{被开方数} 或 \sqrt{被开方数}
  html = html.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g,
    '<span class="math-root"><span class="math-root-exp">$1</span><span class="math-radical">√</span><span class="math-radicand">$2</span></span>')
  html = html.replace(/\\sqrt\{([^}]+)\}/g,
    '<span class="math-root"><span class="math-radical">√</span><span class="math-radicand">$1</span></span>')

  // 积分 \int_a^b
  html = html.replace(/\\int_(\S+)\^(\S+)/g, '∫<sub>$1</sub><sup>$2</sup>')
  html = html.replace(/\\int/g, '∫')

  // 求和 \sum
  html = html.replace(/\\sum/g, '∑')

  // 括号 \left( \right) 等
  html = html.replace(/\\left\(/g, '(')
  html = html.replace(/\\right\)/g, ')')
  html = html.replace(/\\left\[/g, '[')
  html = html.replace(/\\right\]/g, ']')
  html = html.replace(/\\left\\{/g, '{')
  html = html.replace(/\\right\\}/g, '}')

  // 常见运算
  html = html.replace(/\\cdot/g, '·')
  html = html.replace(/\\times/g, '×')
  html = html.replace(/\\div/g, '÷')
  html = html.replace(/\\pm/g, '±')
  html = html.replace(/\\mp/g, '∓')
  html = html.replace(/\\leq/g, '≤')
  html = html.replace(/\\geq/g, '≥')
  html = html.replace(/\\neq/g, '≠')
  html = html.replace(/\\approx/g, '≈')
  html = html.replace(/\\infty/g, '∞')
  html = html.replace(/\\partial/g, '∂')
  html = html.replace(/\\nabla/g, '∇')

  // 去掉多余的反斜杠
  html = html.replace(/\\([a-zA-Z])/g, '$1')

  var tag = isDisplay ? 'div' : 'span'
  return '<' + tag + ' class="math-formula math-' + (isDisplay ? 'display' : 'inline') + '">' + html + '</' + tag + '>'
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

module.exports = {
  parseMathToHtml: parseMathToHtml
}
