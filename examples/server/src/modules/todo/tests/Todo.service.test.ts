import { expect } from 'chai';

import { TodoStatus } from '../Todo.entity';
import { todoService } from '../Todo.service';

import { appDataSource } from '@/src/db';

before(() => {
  return appDataSource.initialize();
});

after(() => {
  return appDataSource.destroy();
});

describe('appDataSource setup', () => {
  it('`appDataSource.isInitialized` should be true', () => {
    expect(appDataSource.isInitialized).to.equal(true);
  });
});

describe('Todo.service test', () => {
  before('create 100 todos', () => {
    return Promise.all(
      Array(100)
        .fill('todo')
        .map((i, idx) =>
          todoService.createTodo(
            {
              title: `${i}-${idx}`,
              status: TodoStatus.todo,
            },
            { type: 'admin', ip: '', lang: '' }
          )
        )
    );
  });
  after('delete todos', async () => {
    const { data } = await todoService.queryTodo({}, { type: 'admin', ip: '', lang: '' });
    return Promise.all(
      data.map((i) =>
        todoService.deleteTodo({ id: i.id } as any, { type: 'admin', ip: '', lang: '' })
      )
    );
  });

  describe('todoService.createTodo and todoService.deleteTo', () => {
    it('todoService.queryTodo should success', async () => {
      expect(
        (await todoService.queryTodo({}, { type: 'admin', ip: '', lang: '' })).data.length
      ).to.equal(100);
    });

    it('todoService.deleteTodo with `id` param should success', async () => {
      await todoService.deleteTodo({ id: 1 } as any, { type: 'admin', ip: '', lang: '' });
      expect(
        (await todoService.queryTodo({}, { type: 'admin', ip: '', lang: '' })).data.length
      ).to.equal(99);
    });

    it('todoService.deleteTodo with `IDs` param should success', async () => {
      await todoService.deleteTodo({ IDs: [2, 3] } as any, { type: 'admin', ip: '', lang: '' });
      expect(
        (await todoService.queryTodo({}, { type: 'admin', ip: '', lang: '' })).data.length
      ).to.equal(97);
    });
  });

  describe('todoService.queryTodo', () => {
    it('queryTodo paginate should success', async () => {
      expect(
        (
          await todoService.queryTodo(
            {
              perPage: 20,
              page: 1,
            },
            { type: 'admin', ip: '', lang: '' }
          )
        ).data.length
      ).to.equal(20);
    });

    it('queryTodo with keyword `todo` should success', async () => {
      expect(
        (
          await todoService.queryTodo(
            {
              keyword: 'todo',
            },
            { type: 'admin', ip: '', lang: '' }
          )
        ).data.length
      ).to.equal(97);
    });

    it('queryTodo with keyword `11` should success', async () => {
      expect(
        (
          await todoService.queryTodo(
            {
              keyword: '11',
            },
            { type: 'admin', ip: '', lang: '' }
          )
        ).data.length
      ).to.equal(1);
    });
  });

  describe('todoService.queryTodoByCursor', () => {
    it('queryTodoByCursor with keyword `todo` should success', async () => {
      const result = await todoService.queryTodoByCursor(
        {
          keyword: 'todo',
        },
        { type: 'admin', ip: '', lang: '' }
      );
      expect(result.data.length).to.equal(97);
    });

    it('queryTodoByCursor with keyword `11` should success', async () => {
      expect(
        (
          await todoService.queryTodoByCursor(
            {
              keyword: '99',
            },
            { type: 'admin', ip: '', lang: '' }
          )
        ).data.length
      ).to.equal(1);
    });

    it('queryTodoByCursor `perPage` 20 paginate should success', async () => {
      expect(
        (
          await todoService.queryTodoByCursor(
            {
              perPage: 20,
            },
            { type: 'admin', ip: '', lang: '' }
          )
        ).data.length
      ).to.equal(20);
    });

    it('queryTodoByCursor paginate `perPage` 10 should success', async () => {
      expect(
        (
          await todoService.queryTodoByCursor(
            {
              perPage: 10,
            },
            { type: 'admin', ip: '', lang: '' }
          )
        ).data.length
      ).to.equal(10);
    });

    it('queryTodoByCursor paginate `beforeCursor` and `afterCursor`', async () => {
      const result = await todoService.queryTodoByCursor(
        {
          perPage: 1,
        },
        { type: 'admin', ip: '', lang: '' }
      );

      expect(result.beforeCursor).to.equal(null);
      expect(typeof result.afterCursor).to.equal('string');
      expect(result.data.length).to.equal(1);

      const result2 = await todoService.queryTodoByCursor(
        {
          perPage: 2,
          afterCursor: result.afterCursor,
        },
        { type: 'admin', ip: '', lang: '' }
      );

      expect(result2.data.length).to.equal(2);
      expect(result2.beforeCursor).not.to.equal(result.afterCursor);

      const result3 = await todoService.queryTodoByCursor(
        {
          beforeCursor: result2.afterCursor,
        },
        { type: 'admin', ip: '', lang: '' }
      );

      console.log(
        result.beforeCursor,
        result.afterCursor,
        result2.beforeCursor,
        result2.afterCursor,
        result3.beforeCursor,
        result3.afterCursor
      );

      expect(result3.beforeCursor).to.equal(null);

      expect(result3.data.length).to.equal(3 - 1);
    });
  });
});
