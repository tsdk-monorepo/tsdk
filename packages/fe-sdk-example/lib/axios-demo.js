'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.setupExample = exports.instance = void 0;
var axios_1 = __importDefault(require('axios'));
var axios_2 = require('./axios');
exports.instance = axios_1.default.create({ baseURL: '' });
function setupExample() {
  (0, axios_2.setAxiosInstance)(exports.instance);
  function handleResponseErrorInterceptor() {
    return (0, axios_2.getAxiosInstance)().interceptors.response.use(
      function (res) {
        return res;
      },
      function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    );
  }
  function handleRequestAuthInterceptor() {
    (0, axios_2.getAxiosInstance)().interceptors.request.use(function (config) {
      var token = '';
      if (token && (config === null || config === void 0 ? void 0 : config.headers)) {
        config.headers.Authorization = 'Bearer '.concat(token);
      }
      return config;
    });
  }
}
exports.setupExample = setupExample;
