'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.trimAndRemoveUndefined = void 0;
/**
 * remove undefined field or trim string value
 *
 * @param data - the object data
 */
var trimAndRemoveUndefined = function (data) {
  var newData = {};
  Object.keys(data).forEach(function (k) {
    var valueType = typeof data[k];
    if (valueType === 'string') {
      newData[k] = data[k].trim();
    } else if (valueType !== 'undefined') {
      newData[k] = data[k];
    }
  });
  return newData;
};
exports.trimAndRemoveUndefined = trimAndRemoveUndefined;
