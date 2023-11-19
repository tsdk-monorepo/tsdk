import * as z from 'zod';

import { PositiveNumberSchema } from '@/src/shared/utils';

export const pageSchema = z.object({
  page: PositiveNumberSchema.optional(),
  perPage: PositiveNumberSchema.optional(),
  beforeCursor: z.string().min(1).optional(),
  afterCursor: z.string().min(1).optional(),
});

export type Paging = {
  page?: number;
  perPage?: number;
  beforeCursor?: string;
  afterCursor?: string;
};

export type PagingRes<Entity> = Paging & {
  total: number;
  data: Entity[];
};
