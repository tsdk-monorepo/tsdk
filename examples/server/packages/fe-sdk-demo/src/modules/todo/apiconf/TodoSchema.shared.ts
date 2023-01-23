import z from 'zod';

import { pageSchema } from '../../../shared/paging';
import { IDSchema } from '../../../shared/utils';
import { TodoStatus } from '../Todo.entity';

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
