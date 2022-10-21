'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AddTodoConfig = void 0;
var TodoSchema_apiconf_1 = require('./TodoSchema.apiconf');
var tsdk_helper_1 = require('../../../shared/tsdk-helper');
exports.AddTodoConfig = {
  path: (0, tsdk_helper_1.transformPath)('AddTodo'),
  method: 'post',
  name: 'AddTodo',
  description: 'add todo',
  category: 'todo',
  type: 'user',
  schema: TodoSchema_apiconf_1.addTodoSchema,
};
