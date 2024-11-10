var AsyncGenerator = require("./AsyncGenerator.js");
function _wrapAsyncGenerator(r) {
  return function () {
    return new AsyncGenerator(r.apply(this, arguments));
  };
}
module.exports = _wrapAsyncGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;