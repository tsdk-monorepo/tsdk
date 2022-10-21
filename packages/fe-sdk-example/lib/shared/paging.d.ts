import z from 'zod';
export declare const pageSchema: z.ZodObject<
  {
    page: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
    perPage: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
    beforeCursor: z.ZodOptional<z.ZodString>;
    afterCursor: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    page?: number | undefined;
    perPage?: number | undefined;
    beforeCursor?: string | undefined;
    afterCursor?: string | undefined;
  },
  {
    page?: unknown;
    perPage?: unknown;
    beforeCursor?: string | undefined;
    afterCursor?: string | undefined;
  }
>;
export declare type Paging = {
  page?: number;
  perPage?: number;
  beforeCursor?: string;
  afterCursor?: string;
};
export declare type PagingRes<Entity> = Paging & {
  total: number;
  data: Entity[];
};
