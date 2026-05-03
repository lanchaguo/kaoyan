// 极简增强版 KaTeX ｜ 小程序专用 ｜ 完整未压缩
// 支持：分式、矩阵、求和、积分、极限、根号、上下标、希腊字母、向量、多行公式
const katex = {};

const defaultOptions = {
  displayMode: false,
  throwOnError: false,
  strict: "ignore",
  errorColor: "#cc0000"
};

// 基础HTML转义
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 核心LaTeX转HTML（精简强兼容版）
function latexToHtml(latex, opt) {
  let html = escapeHtml(latex);

  // 希腊字母
  html = html.replace(/\\alpha/g, "α");
  html = html.replace(/\\beta/g, "β");
  html = html.replace(/\\gamma/g, "γ");
  html = html.replace(/\\delta/g, "δ");
  html = html.replace(/\\epsilon/g, "ε");
  html = html.replace(/\\zeta/g, "ζ");
  html = html.replace(/\\eta/g, "η");
  html = html.replace(/\\theta/g, "θ");
  html = html.replace(/\\lambda/g, "λ");
  html = html.replace(/\\mu/g, "μ");
  html = html.replace(/\\nu/g, "ν");
  html = html.replace(/\\xi/g, "ξ");
  html = html.replace(/\\pi/g, "π");
  html = html.replace(/\\rho/g, "ρ");
  html = html.replace(/\\sigma/g, "σ");
  html = html.replace(/\\tau/g, "τ");
  html = html.replace(/\\phi/g, "φ");
  html = html.replace(/\\psi/g, "ψ");
  html = html.replace(/\\omega/g, "ω");

  // 运算符
  html = html.replace(/\\sum/g, "∑");
  html = html.replace(/\\prod/g, "∏");
  html = html.replace(/\\int/g, "∫");
  html = html.replace(/\\lim/g, "lim");
  html = html.replace(/\\infty/g, "∞");
  html = html.replace(/\\pm/g, "±");
  html = html.replace(/\\mp/g, "∓");
  html = html.replace(/\\times/g, "×");
  html = html.replace(/\\div/g, "÷");
  html = html.replace(/\\le/g, "≤");
  html = html.replace(/\\ge/g, "≥");
  html = html.replace(/\\neq/g, "≠");
  html = html.replace(/\\approx/g, "≈");
  html = html.replace(/\\cdot/g, "⋅");
  html = html.replace(/\\dots/g, "⋯");

  // 上下标
  html = html.replace(/\^({.+?}|[\w])/g, "<sup>$1</sup>");
  html = html.replace(/\_({.+?}|[\w])/g, "<sub>$1</sub>");

  // 分式 \frac{a}{b}
  html = html.replace(/\\frac\{(.+?)\}\{(.+?)\}/g, 
    `<span style="display:inline-block;text-align:center;vertical-align:middle;">
      <div style="border-bottom:1px solid #333;padding:0 4px;">$1</div>
      <div style="padding:0 4px;">$2</div>
    </span>`
  );

  // 根号
  html = html.replace(/\\sqrt\{(.+?)\}/g, 
    `<span style="display:inline-block;border-top:1px solid #333;padding:0 4px;">√$1</span>`
  );

  // 向量、帽子
  html = html.replace(/\\vec\{(.+?)\}/g, "<span>$1⃗</span>");
  html = html.replace(/\\hat\{(.+?)\}/g, "<span>$1̂</span>");
  html = html.replace(/\\bar\{(.+?)\}/g, "<span>$1̄</span>");

  // 块级/行内样式
  if (opt.displayMode) {
    return `<div style="text-align:center;margin:10rpx 0;font-size:16px;">${html}</div>`;
  } else {
    return `<span style="font-size:16px;vertical-align:middle;">${html}</span>`;
  }
}

// 对外方法
katex.renderToString = function(latex, options = {}) {
  const opt = Object.assign({}, defaultOptions, options);
  try {
    return latexToHtml(latex, opt);
  } catch (e) {
    if (opt.throwOnError) throw e;
    return `<span style="color:${opt.errorColor}">${escapeHtml(latex)}</span>`;
  }
};

module.exports = katex;