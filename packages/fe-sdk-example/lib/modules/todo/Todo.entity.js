'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.Todo = exports.todoStatus = exports.TodoStatus = void 0;
var CreatedUpdated_entity_1 = require('../../db/entity/CreatedUpdated.entity');
var TodoStatus;
(function (TodoStatus) {
  TodoStatus['todo'] = 'todo';
  TodoStatus['doing'] = 'doing';
  TodoStatus['completed'] = 'completed';
  TodoStatus['deleted'] = 'deleted';
})((TodoStatus = exports.TodoStatus || (exports.TodoStatus = {})));
exports.todoStatus = Object.values(TodoStatus);
var entityName = 'todo_item';
var Todo = /** @class */ (function (_super) {
  __extends(Todo, _super);
  function Todo() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Todo.entityName = entityName;
  return Todo;
})(CreatedUpdated_entity_1.CreatedUpdatedAt);
exports.Todo = Todo;
