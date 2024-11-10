var arrayWithHoles = require("./arrayWithHoles.js");
var iterableToArrayLimitLoose = require("./iterableToArrayLimitLoose.js");
var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");
var nonIterableRest = require("./nonIterableRest.js");
function _slicedToArrayLoose(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimitLoose(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArrayLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;