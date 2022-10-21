'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.pageSchema = void 0;
var zod_1 = __importDefault(require('zod'));
var utils_1 = require('./utils');
exports.pageSchema = zod_1.default.object({
  page: utils_1.PositiveNumberSchema.optional(),
  perPage: utils_1.PositiveNumberSchema.optional(),
  beforeCursor: zod_1.default.string().min(1).optional(),
  afterCursor: zod_1.default.string().min(1).optional(),
});
