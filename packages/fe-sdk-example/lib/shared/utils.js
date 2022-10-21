'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.IDSchema = exports.PositiveNumberSchema = exports.sleep = exports.sum = void 0;
var zod_1 = require('zod');
/**
 * Math sum
 * @param a number
 * @param b number
 * @returns number
 */
var sum = function (a, b) {
  return a + b;
};
exports.sum = sum;
/**
 * promisify `setTimeout`
 * @param ms number
 * @returns Promise<any>
 */
var sleep = function (ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
exports.sleep = sleep;
exports.PositiveNumberSchema = zod_1.z.preprocess(function (val) {
  if (typeof val === 'string') {
    return parseInt(val, 10);
  }
  return val;
}, zod_1.z.number().positive());
exports.IDSchema = exports.PositiveNumberSchema;
