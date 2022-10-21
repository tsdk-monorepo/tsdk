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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.axiosHandler = exports.getAxiosInstance = exports.setAxiosInstance = void 0;
var tsdk_helper_1 = require('./shared/tsdk-helper');
var axiosInstance;
/**
 * Set the AxiosInstance
 *
 * @param instance - AxiosInstance
 */
var setAxiosInstance = function (instance) {
  axiosInstance = instance;
};
exports.setAxiosInstance = setAxiosInstance;
/**
 * Get the AxiosInstance
 *
 * @param instance - AxiosInstance
 * @returns The AxiosInstance
 */
var getAxiosInstance = function () {
  return axiosInstance;
};
exports.getAxiosInstance = getAxiosInstance;
function axiosHandler(apiConfig, requestData, requestConfig, needTrim) {
  return __awaiter(this, void 0, void 0, function () {
    var axiosInstance, msg, path, headers, method, payload, data_1, data;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          axiosInstance = (0, exports.getAxiosInstance)();
          if (!axiosInstance) {
            msg = 'Please call `setAxiosInstance` first or pass `axiosInstance` argument';
            throw msg;
          }
          (path = apiConfig.path), (headers = apiConfig.headers);
          method = apiConfig.method.toLowerCase();
          payload = __assign({ method: method, url: path }, requestConfig);
          if (headers) {
            payload.headers = __assign(__assign({}, payload.headers), headers);
          }
          if (requestData) {
            data_1 = needTrim
              ? (0, tsdk_helper_1.trimAndRemoveUndefined)(requestData)
              : requestData;
            if ((0, tsdk_helper_1.checkMethodHasBody)(method)) {
              payload.data = data_1;
              if (
                requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.params
              ) {
                payload.params = requestConfig.params;
              }
            } else {
              payload.params = (
                requestConfig === null || requestConfig === void 0 ? void 0 : requestConfig.params
              )
                ? __assign(__assign({}, requestConfig.params), data_1)
                : data_1;
            }
          }
          return [4 /*yield*/, axiosInstance.request(payload)];
        case 1:
          data = _a.sent().data;
          return [2 /*return*/, data];
      }
    });
  });
}
exports.axiosHandler = axiosHandler;
