'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.QueryTodoConfig = void 0;
var tsdk_helper_1 = require('../../../shared/tsdk-helper');
var TodoSchema_apiconf_1 = require('./TodoSchema.apiconf');
exports.QueryTodoConfig = {
  path: (0, tsdk_helper_1.transformPath)('QueryTodo'),
  method: 'get',
  name: 'QueryTodo',
  description: 'query todo',
  category: 'todo',
  type: 'user',
  schema: TodoSchema_apiconf_1.queryTodoSchema,
};
