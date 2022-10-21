'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.QueryTodoByCursorConfig = void 0;
var tsdk_helper_1 = require('../../../shared/tsdk-helper');
var TodoSchema_apiconf_1 = require('./TodoSchema.apiconf');
/**
 * query todo list by cursor ({@link APIConfig})
 * @category QueryTodoByCursor
 */
exports.QueryTodoByCursorConfig = {
  type: 'user',
  name: 'QueryTodoByCursor',
  method: 'get',
  path: (0, tsdk_helper_1.transformPath)('QueryTodoByCursor'),
  schema: TodoSchema_apiconf_1.queryTodoByCursorSchema,
  description: 'query todo list by cursor',
};
// --------- QueryTodoByCursor END ---------
