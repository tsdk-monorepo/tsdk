import { Todo } from './Todo.entity';

import { registerEntites } from '@/src/db/register-entities';

registerEntites([Todo]);

export * from './Todo.entity';
export * from './Todo.service';
