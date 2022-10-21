import z from 'zod';
import { TodoStatus } from '../Todo.entity';
export declare const TodoSchema: z.ZodObject<
  {
    id: z.ZodEffects<z.ZodNumber, number, unknown>;
    title: z.ZodString;
    status: z.ZodNativeEnum<typeof TodoStatus>;
    remark: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    id: number;
    title: string;
    status: TodoStatus;
    remark: string;
  },
  {
    id?: unknown;
    title: string;
    status: TodoStatus;
    remark: string;
  }
>;
export declare const queryTodoSchema: z.ZodObject<
  z.extendShape<
    {
      page: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
      perPage: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
      beforeCursor: z.ZodOptional<z.ZodString>;
      afterCursor: z.ZodOptional<z.ZodString>;
    },
    {
      keyword: z.ZodOptional<z.ZodString>;
    }
  >,
  'strip',
  z.ZodTypeAny,
  {
    page?: number | undefined;
    perPage?: number | undefined;
    beforeCursor?: string | undefined;
    afterCursor?: string | undefined;
    keyword?: string | undefined;
  },
  {
    page?: unknown;
    perPage?: unknown;
    beforeCursor?: string | undefined;
    afterCursor?: string | undefined;
    keyword?: string | undefined;
  }
>;
export declare const queryTodoByCursorSchema: z.ZodObject<
  z.extendShape<
    {
      page: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
      perPage: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
      beforeCursor: z.ZodOptional<z.ZodString>;
      afterCursor: z.ZodOptional<z.ZodString>;
    },
    {
      keyword: z.ZodOptional<z.ZodString>;
    }
  >,
  'strip',
  z.ZodTypeAny,
  {
    page?: number | undefined;
    perPage?: number | undefined;
    beforeCursor?: string | undefined;
    afterCursor?: string | undefined;
    keyword?: string | undefined;
  },
  {
    page?: unknown;
    perPage?: unknown;
    beforeCursor?: string | undefined;
    afterCursor?: string | undefined;
    keyword?: string | undefined;
  }
>;
export declare const addTodoSchema: z.ZodObject<
  {
    title: z.ZodString;
    status: z.ZodNativeEnum<typeof TodoStatus>;
    remark: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    remark?: string | undefined;
    title: string;
    status: TodoStatus;
  },
  {
    remark?: string | undefined;
    title: string;
    status: TodoStatus;
  }
>;
export declare const updateTodoSchema: z.ZodEffects<
  z.ZodObject<
    z.extendShape<
      {
        title: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodNativeEnum<typeof TodoStatus>>;
        remark: z.ZodOptional<z.ZodString>;
      },
      {
        id: z.ZodEffects<z.ZodNumber, number, unknown>;
      }
    >,
    'strip',
    z.ZodTypeAny,
    {
      title?: string | undefined;
      status?: TodoStatus | undefined;
      remark?: string | undefined;
      id: number;
    },
    {
      id?: unknown;
      title?: string | undefined;
      status?: TodoStatus | undefined;
      remark?: string | undefined;
    }
  >,
  {
    title?: string | undefined;
    status?: TodoStatus | undefined;
    remark?: string | undefined;
    id: number;
  },
  {
    id?: unknown;
    title?: string | undefined;
    status?: TodoStatus | undefined;
    remark?: string | undefined;
  }
>;
export declare const deleteTodoSchema: z.ZodUnion<
  [
    z.ZodObject<
      Pick<
        {
          id: z.ZodEffects<z.ZodNumber, number, unknown>;
          title: z.ZodString;
          status: z.ZodNativeEnum<typeof TodoStatus>;
          remark: z.ZodString;
        },
        'id'
      >,
      'strip',
      z.ZodTypeAny,
      {
        id: number;
      },
      {
        id?: unknown;
      }
    >,
    z.ZodObject<
      {
        IDs: z.ZodArray<z.ZodEffects<z.ZodNumber, number, unknown>, 'atleastone'>;
      },
      'strip',
      z.ZodTypeAny,
      {
        IDs: [number, ...number[]];
      },
      {
        IDs: [unknown, ...unknown[]];
      }
    >
  ]
>;
