import { registerEntites } from '/src/db/register-entities';

import { Todo } from './Todo.entity';

registerEntites([Todo]);

export * from './Todo.entity';
export * from './Todo.service';
