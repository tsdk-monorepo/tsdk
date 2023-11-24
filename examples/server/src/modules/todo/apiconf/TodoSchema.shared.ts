import * as z from 'zod';

import { TodoStatus } from '../Todo.entity';

import { pageSchema } from '@/src/shared/paging';
import { IDSchema } from '@/src/shared/utils';

export const TodoSchema = z.object({
  id: IDSchema,
  title: z.string().min(1),
  status: z.nativeEnum(TodoStatus),
  remark: z.string(),
});

export const queryTodoSchema = pageSchema.extend({
  keyword: z.string().min(1).optional(),
});

export const queryTodoByCursorSchema = queryTodoSchema;

export const addTodoSchema = TodoSchema.omit({
  id: true,
}).partial({
  remark: true,
});

export const updateTodoSchema = TodoSchema.omit({ id: true })
  .partial()
  .extend({
    id: IDSchema,
  })
  .refine(
    ({ id, ...rest }) => Object.values(rest).some((i) => i !== undefined),
    (val) => ({ message: `One of the fields must be defined` })
  );

export const deleteTodoSchema = TodoSchema.pick({
  id: true,
}).or(
  z.object({
    IDs: IDSchema.array().nonempty(),
  })
);
