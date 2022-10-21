'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.socketIOHandler = exports.getSocketIOInstance = exports.setSocketIOInstance = void 0;
var tsdk_helper_1 = require('./shared/tsdk-helper');
var socketIOInstance;
/**
 * Set the io
 *
 * @param instance - io
 */
var setSocketIOInstance = function (instance) {
  socketIOInstance = instance;
  socketIOInstance.off(tsdk_helper_1.TYPE.response);
  socketIOInstance.on(tsdk_helper_1.TYPE.response, function (_a) {
    var msgId = _a._id,
      data = __rest(_a, ['_id']);
    if (msgId && QUEUEs[msgId]) {
      !data.status || data.status === 200
        ? QUEUEs[msgId].resolve(data)
        : QUEUEs[msgId].reject(data);
      delete QUEUEs[msgId];
    }
  });
};
exports.setSocketIOInstance = setSocketIOInstance;
// const socket = io('https://server-domain.com', {
//   transports: ['websocket'],
// });
// setSocketIOInstance(socket);
/**
 * Get the io
 *
 * @param instance - io
 * @returns The io
 */
var getSocketIOInstance = function () {
  return socketIOInstance;
};
exports.getSocketIOInstance = getSocketIOInstance;
var QUEUEs = {};
var ID = 0;
function socketIOHandler(apiConfig, data, requestConfig, needTrim) {
  var ioInstance = (0, exports.getSocketIOInstance)();
  if (!ioInstance) {
    var msg =
      'Please call `setSocketIOInstance` first or pass `socket.io-client instance` argument';
    throw msg;
  }
  return new Promise(function (resolve, reject) {
    if (!ioInstance.connected) {
      return reject('No Connection');
    }
    var msgId = ''
      .concat(apiConfig.method === 'get' ? '' : '', ':')
      .concat(apiConfig.path, ':')
      .concat(++ID)
      .concat(Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(-4));
    ioInstance.emit(
      tsdk_helper_1.TYPE.request,
      __assign(
        __assign({}, needTrim && data ? (0, tsdk_helper_1.trimAndRemoveUndefined)(data) : {}),
        { _id: msgId }
      )
    );
    var timer = (
      requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.timeout
    )
      ? setTimeout(function () {
          delete QUEUEs[msgId];
          reject('Request Timeout');
        }, requestConfig.timeout)
      : -1;
    QUEUEs[msgId] = {
      resolve: function (res) {
        clearTimeout(timer);
        resolve(res);
      },
      reject: function (e) {
        clearTimeout(timer);
        reject(e);
      },
    };
  });
}
exports.socketIOHandler = socketIOHandler;
