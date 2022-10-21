'use strict';
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteTodoSchema =
  exports.updateTodoSchema =
  exports.addTodoSchema =
  exports.queryTodoByCursorSchema =
  exports.queryTodoSchema =
  exports.TodoSchema =
    void 0;
var zod_1 = __importDefault(require('zod'));
var utils_1 = require('../../../shared/utils');
var Todo_entity_1 = require('../Todo.entity');
var paging_1 = require('../../../shared/paging');
exports.TodoSchema = zod_1.default.object({
  id: utils_1.IDSchema,
  title: zod_1.default.string().min(1),
  status: zod_1.default.nativeEnum(Todo_entity_1.TodoStatus),
  remark: zod_1.default.string(),
});
exports.queryTodoSchema = paging_1.pageSchema.extend({
  keyword: zod_1.default.string().min(1).optional(),
});
exports.queryTodoByCursorSchema = exports.queryTodoSchema;
exports.addTodoSchema = exports.TodoSchema.omit({
  id: true,
}).partial({
  remark: true,
});
exports.updateTodoSchema = exports.TodoSchema.omit({ id: true })
  .partial()
  .extend({
    id: utils_1.IDSchema,
  })
  .refine(
    function (_a) {
      var id = _a.id,
        rest = __rest(_a, ['id']);
      return Object.values(rest).some(function (i) {
        return i !== undefined;
      });
    },
    function (val) {
      return { message: 'One of the fields must be defined' };
    }
  );
exports.deleteTodoSchema = exports.TodoSchema.pick({
  id: true,
}).or(
  zod_1.default.object({
    IDs: utils_1.IDSchema.array().nonempty(),
  })
);
