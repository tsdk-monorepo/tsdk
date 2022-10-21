import expect from "expect";
import { IDSchema } from "/src/shared/utils";
import {
  addTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
} from "../apiconf/TodoSchema.apiconf";
import { TodoStatus } from "../Todo.entity";

describe("TodoSchema tests", () => {
  describe("IDSchema tests", () => {
    it("`IDSchema.parse(1)` should be ok", () => {
      const id = IDSchema.parse(1);
      expect(id).toBe(1);
    });

    it("`IDSchema.parse(0)` should throwError", () => {
      expect(() => IDSchema.parse(0)).toThrowError();
    });

    it("`IDSchema.parse(-99)` should throwError", () => {
      expect(() => IDSchema.parse(-99)).toThrowError();
    });
  });

  describe("addTodoSchema tests", () => {
    it("addTodoSchema parse correct data should ok", () => {
      const result = addTodoSchema.parse({
        title: "todo",
        status: TodoStatus.todo,
        remark: "hi",
      });

      expect(result.title).toBe("todo");
      expect(result.status).toBe(TodoStatus.todo);
      expect(result.remark).toBe("hi");
    });

    it("addTodoSchema parse without remark should ok", () => {
      const result = addTodoSchema.parse({
        title: "todo",
        status: TodoStatus.todo,
      });

      expect(result.title).toBe("todo");
      expect(result.status).toBe(TodoStatus.todo);
      expect(result.remark).toBeUndefined();
    });

    it("addTodoSchema parse should throwError with title/remark is number", () => {
      expect(() =>
        addTodoSchema.parse({
          title: 1,
          status: TodoStatus.todo,
          remark: "hi",
        })
      ).toThrowError();
    });

    it("addTodoSchema should throwError without status", () => {
      expect(() =>
        addTodoSchema.parse({
          title: "todo",
          remark: "hi",
        })
      ).toThrowError();
    });
  });

  describe("updateTodoSchema tests", () => {
    it("updateTodoSchema parse correct full data should ok", () => {
      const result = updateTodoSchema.parse({
        id: 1,
        title: "todo",
        status: TodoStatus.todo,
        remark: "hi",
      });

      expect(result.id).toBe(1);
      expect(result.title).toBe("todo");
      expect(result.status).toBe(TodoStatus.todo);
      expect(result.remark).toBe("hi");
    });

    it("updateTodoSchema parse correct `title` data should ok", () => {
      const result = updateTodoSchema.parse({
        id: 1,
        title: "todo",
      });

      expect(result.id).toBe(1);
      expect(result.title).toBe("todo");
    });

    it("updateTodoSchema parse correct `remark` data should ok", () => {
      const result = updateTodoSchema.parse({
        id: 1,
        status: TodoStatus.todo,
      });

      expect(result.id).toBe(1);
      expect(result.status).toBe(TodoStatus.todo);

      const result2 = updateTodoSchema.parse({
        id: 1,
        remark: "hi",
      });

      expect(result2.id).toBe(1);
      expect(result2.remark).toBe("hi");

      const result3 = updateTodoSchema.parse({
        id: "1",
        remark: "hi",
      });

      expect(result3.id).toBe(1);
      expect(result3.remark).toBe("hi");
    });

    it("updateTodoSchema parse without `id` should throwError", () => {
      expect(() =>
        updateTodoSchema.parse({
          title: "todo",
        })
      ).toThrowError();
    });

    it("updateTodoSchema parse with negative `id` should throwError", () => {
      expect(() =>
        updateTodoSchema.parse({
          id: 0,
          title: "todo",
        })
      ).toThrowError();
    });
  });

  describe("deleteTodoSchema tests", () => {
    it("deleteTodoSchema parse correct data should ok", () => {
      const result = deleteTodoSchema.parse({
        id: 1,
      });

      // @todo fix zod wrong type
      expect((result as { id: number }).id).toBe(1);

      expect(
        (
          deleteTodoSchema.parse({
            id: "1",
          }) as { id: number }
        ).id
      ).toBe(1);

      const result2 = deleteTodoSchema.parse({
        IDs: [1, 2, 3],
      });

      expect((result2 as { IDs: number[] }).IDs.length).toBe(3);

      const result3 = deleteTodoSchema.parse({
        IDs: ["1", "2", "3"],
      });

      expect((result3 as { IDs: number[] }).IDs.length).toBe(3);
      expect((result3 as { IDs: number[] }).IDs[0]).toBe(1);
      expect((result3 as { IDs: number[] }).IDs[1]).toBe(2);
      expect((result3 as { IDs: number[] }).IDs[2]).toBe(3);
    });

    it("deleteTodoSchema parse should throwError with negative value", () => {
      expect(() =>
        deleteTodoSchema.parse({
          id: 0,
        })
      ).toThrowError();

      expect(() =>
        deleteTodoSchema.parse({
          id: -1,
        })
      ).toThrowError();

      expect(() =>
        deleteTodoSchema.parse({
          id: "-1",
        })
      ).toThrowError();

      expect(() =>
        deleteTodoSchema.parse({
          IDs: [0],
        })
      ).toThrowError();

      expect(() =>
        deleteTodoSchema.parse({
          IDs: [-1],
        })
      ).toThrowError();

      expect(() =>
        deleteTodoSchema.parse({
          IDs: ["-1"],
        })
      ).toThrowError();
    });
  });
});
