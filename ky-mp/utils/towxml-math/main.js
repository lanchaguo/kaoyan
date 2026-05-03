const parse = require('./parse.js');
function towxmlMath(content, options = {}) {
  const opts = { math: true, ...options };
  return parse(content, opts);
}
module.exports = towxmlMath;
