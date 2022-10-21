'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DeleteTodoConfig = void 0;
var tsdk_helper_1 = require('../../../shared/tsdk-helper');
var TodoSchema_apiconf_1 = require('./TodoSchema.apiconf');
exports.DeleteTodoConfig = {
  path: (0, tsdk_helper_1.transformPath)('DeleteTodo'),
  method: 'post',
  name: 'DeleteTodo',
  description: 'delete todo',
  category: 'todo',
  type: 'user',
  schema: TodoSchema_apiconf_1.deleteTodoSchema,
};
