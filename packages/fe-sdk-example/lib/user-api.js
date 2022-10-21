'use strict';
/**
 *
 * api-user.ts
 * @suhaotian/fe-sdk-example@1.0.0
 *
 **/
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.QueryTodo =
  exports.DeleteTodo =
  exports.UpdateTodo =
  exports.QueryTodoByCursor =
  exports.AddTodo =
    void 0;
var gen_api_1 = __importDefault(require('./gen-api'));
var apiconf_refs_1 = require('./apiconf-refs');
/**
 * add todo
 *
 * @category todo
 */
exports.AddTodo = (0, gen_api_1.default)(apiconf_refs_1.AddTodoConfig);
/**
 * query todo list by cursor
 *
 * @category others
 */
exports.QueryTodoByCursor = (0, gen_api_1.default)(apiconf_refs_1.QueryTodoByCursorConfig);
/**
 * update todo
 *
 * @category todo
 */
exports.UpdateTodo = (0, gen_api_1.default)(apiconf_refs_1.UpdateTodoConfig);
/**
 * delete todo
 *
 * @category todo
 */
exports.DeleteTodo = (0, gen_api_1.default)(apiconf_refs_1.DeleteTodoConfig);
/**
 * query todo
 *
 * @category todo
 */
exports.QueryTodo = (0, gen_api_1.default)(apiconf_refs_1.QueryTodoConfig);
