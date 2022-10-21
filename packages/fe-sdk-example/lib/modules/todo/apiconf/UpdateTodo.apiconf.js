'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateTodoConfig = void 0;
var TodoSchema_apiconf_1 = require('./TodoSchema.apiconf');
var tsdk_helper_1 = require('../../../shared/tsdk-helper');
exports.UpdateTodoConfig = {
  path: (0, tsdk_helper_1.transformPath)('UpdateTodo'),
  method: 'post',
  name: 'UpdateTodo',
  description: 'update todo',
  category: 'todo',
  type: 'user',
  schema: TodoSchema_apiconf_1.updateTodoSchema,
};
