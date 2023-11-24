import { expect } from 'chai';

import { TodoStatus } from '../Todo.entity';
import { addTodoSchema, updateTodoSchema, deleteTodoSchema } from '../apiconf/TodoSchema.shared';

import { IDSchema } from '@/src/shared/utils';

describe('TodoSchema tests', () => {
  describe('IDSchema tests', () => {
    it('`IDSchema.parse(1)` should be ok', () => {
      const id = IDSchema.parse(1);
      expect(id).to.equal(1);
    });

    it('`IDSchema.parse(0)` should throwError', () => {
      expect(() => IDSchema.parse(0)).to.throw();
    });

    it('`IDSchema.parse(-99)` should throwError', () => {
      expect(() => IDSchema.parse(-99)).to.throw();
    });
  });

  describe('addTodoSchema tests', () => {
    it('addTodoSchema parse correct data should ok', () => {
      const result = addTodoSchema.parse({
        title: 'todo',
        status: TodoStatus.todo,
        remark: 'hi',
      });

      expect(result.title).to.equal('todo');
      expect(result.status).to.equal(TodoStatus.todo);
      expect(result.remark).to.equal('hi');
    });

    it('addTodoSchema parse without remark should ok', () => {
      const result = addTodoSchema.parse({
        title: 'todo',
        status: TodoStatus.todo,
      });

      expect(result.title).to.equal('todo');
      expect(result.status).to.equal(TodoStatus.todo);
      expect(result.remark).to.equal(undefined);
    });

    it('addTodoSchema parse should throwError with title/remark is number', () => {
      expect(() =>
        addTodoSchema.parse({
          title: 1,
          status: TodoStatus.todo,
          remark: 'hi',
        })
      ).to.Throw();
    });

    it('addTodoSchema should throwError without status', () => {
      expect(() =>
        addTodoSchema.parse({
          title: 'todo',
          remark: 'hi',
        })
      ).to.Throw();
    });
  });

  describe('updateTodoSchema tests', () => {
    it('updateTodoSchema parse correct full data should ok', () => {
      const result = updateTodoSchema.parse({
        id: 1,
        title: 'todo',
        status: TodoStatus.todo,
        remark: 'hi',
      });

      expect(result.id).to.equal(1);
      expect(result.title).to.equal('todo');
      expect(result.status).to.equal(TodoStatus.todo);
      expect(result.remark).to.equal('hi');
    });

    it('updateTodoSchema parse correct `title` data should ok', () => {
      const result = updateTodoSchema.parse({
        id: 1,
        title: 'todo',
      });

      expect(result.id).to.equal(1);
      expect(result.title).to.equal('todo');
    });

    it('updateTodoSchema parse correct `remark` data should ok', () => {
      const result = updateTodoSchema.parse({
        id: 1,
        status: TodoStatus.todo,
      });

      expect(result.id).to.equal(1);
      expect(result.status).to.equal(TodoStatus.todo);

      const result2 = updateTodoSchema.parse({
        id: 1,
        remark: 'hi',
      });

      expect(result2.id).to.equal(1);
      expect(result2.remark).to.equal('hi');

      const result3 = updateTodoSchema.parse({
        id: '1',
        remark: 'hi',
      });

      expect(result3.id).to.equal(1);
      expect(result3.remark).to.equal('hi');
    });

    it('updateTodoSchema parse without `id` should throwError', () => {
      expect(() =>
        updateTodoSchema.parse({
          title: 'todo',
        })
      ).to.Throw();
    });

    it('updateTodoSchema parse with negative `id` should throwError', () => {
      expect(() =>
        updateTodoSchema.parse({
          id: 0,
          title: 'todo',
        })
      ).to.Throw();
    });
  });

  describe('deleteTodoSchema tests', () => {
    it('deleteTodoSchema parse correct data should ok', () => {
      const result = deleteTodoSchema.parse({
        id: 1,
      });

      // @todo fix zod wrong type
      expect((result as { id: number }).id).to.equal(1);

      expect(
        (
          deleteTodoSchema.parse({
            id: '1',
          }) as { id: number }
        ).id
      ).to.equal(1);

      const result2 = deleteTodoSchema.parse({
        IDs: [1, 2, 3],
      });

      expect((result2 as { IDs: number[] }).IDs.length).to.equal(3);

      const result3 = deleteTodoSchema.parse({
        IDs: ['1', '2', '3'],
      });

      expect((result3 as { IDs: number[] }).IDs.length).to.equal(3);
      expect((result3 as { IDs: number[] }).IDs[0]).to.equal(1);
      expect((result3 as { IDs: number[] }).IDs[1]).to.equal(2);
      expect((result3 as { IDs: number[] }).IDs[2]).to.equal(3);
    });

    it('deleteTodoSchema parse should throwError with negative value', () => {
      expect(() =>
        deleteTodoSchema.parse({
          id: 0,
        })
      ).to.Throw();

      expect(() =>
        deleteTodoSchema.parse({
          id: -1,
        })
      ).to.Throw();

      expect(() =>
        deleteTodoSchema.parse({
          id: '-1',
        })
      ).to.Throw();

      expect(() =>
        deleteTodoSchema.parse({
          IDs: [0],
        })
      ).to.Throw();

      expect(() =>
        deleteTodoSchema.parse({
          IDs: [-1],
        })
      ).to.Throw();

      expect(() =>
        deleteTodoSchema.parse({
          IDs: ['-1'],
        })
      ).to.Throw();
    });
  });
});
