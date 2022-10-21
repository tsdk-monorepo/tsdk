'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.PROTOCOL_VALUEs =
  exports.PROTOCOLs =
  exports.TYPE =
  exports.transformPath =
  exports.checkMethodHasBody =
  exports.withDataMethods =
    void 0;
var change_case_1 = require('change-case');
__exportStar(require('./tsdk-types'), exports);
exports.withDataMethods = {
  post: true,
  put: true,
  patch: true,
};
function checkMethodHasBody(method) {
  return exports.withDataMethods[method];
}
exports.checkMethodHasBody = checkMethodHasBody;
function transformPath(path) {
  return '/'.concat((0, change_case_1.paramCase)(path));
}
exports.transformPath = transformPath;
exports.TYPE = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};
exports.PROTOCOLs = {
  http: 'http',
  ws: 'ws',
  'socket.io': 'io',
};
exports.PROTOCOL_VALUEs = Object.values(exports.PROTOCOLs);
