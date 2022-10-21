import expect from "expect";
import { appDataSource } from "/src/db";
import { todoService } from "../Todo.service";
import { TodoStatus } from "../Todo.entity";

before(() => {
  return appDataSource.initialize();
});

after(() => {
  return appDataSource.destroy();
});

describe("appDataSource setup", () => {
  it("`appDataSource.isInitialized` should be true", () => {
    expect(appDataSource.isInitialized).toBe(true);
  });
});

describe("Todo.service test", () => {
  before("create 100 todos", () => {
    return Promise.all(
      Array(100)
        .fill("todo")
        .map((i, idx) =>
          todoService.createTodo({
            title: `${i}-${idx}`,
            status: TodoStatus.todo,
          })
        )
    );
  });
  after("delete todos", async () => {
    const { data } = await todoService.queryTodo({});
    return Promise.all(data.map((i) => todoService.deleteTodo({ id: i.id } as any)));
  });

  describe("todoService.createTodo and todoService.deleteTo", () => {
    it("todoService.queryTodo should success", async () => {
      expect((await todoService.queryTodo({})).data.length).toBe(100);
    });

    it("todoService.deleteTodo with `id` param should success", async () => {
      await todoService.deleteTodo({ id: 1 } as any);
      expect((await todoService.queryTodo({})).data.length).toBe(99);
    });

    it("todoService.deleteTodo with `IDs` param should success", async () => {
      await todoService.deleteTodo({ IDs: [2, 3] } as any);
      expect((await todoService.queryTodo({})).data.length).toBe(97);
    });
  });

  describe("todoService.queryTodo", () => {
    it("queryTodo paginate should success", async () => {
      expect(
        (
          await todoService.queryTodo({
            perPage: 20,
            page: 1,
          })
        ).data.length
      ).toBe(20);
    });

    it("queryTodo with keyword `todo` should success", async () => {
      expect(
        (
          await todoService.queryTodo({
            keyword: "todo",
          })
        ).data.length
      ).toBe(97);
    });

    it("queryTodo with keyword `11` should success", async () => {
      expect(
        (
          await todoService.queryTodo({
            keyword: "11",
          })
        ).data.length
      ).toBe(1);
    });
  });

  describe("todoService.queryTodoByCursor", () => {
    it("queryTodoByCursor with keyword `todo` should success", async () => {
      const result = await todoService.queryTodoByCursor({
        keyword: "todo",
      });
      expect(result.data.length).toBe(97);
    });

    it("queryTodoByCursor with keyword `11` should success", async () => {
      expect(
        (
          await todoService.queryTodoByCursor({
            keyword: "99",
          })
        ).data.length
      ).toBe(1);
    });

    it("queryTodoByCursor `perPage` 20 paginate should success", async () => {
      expect(
        (
          await todoService.queryTodoByCursor({
            perPage: 20,
          })
        ).data.length
      ).toBe(20);
    });

    it("queryTodoByCursor paginate `perPage` 10 should success", async () => {
      expect(
        (
          await todoService.queryTodoByCursor({
            perPage: 10,
          })
        ).data.length
      ).toBe(10);
    });

    it("queryTodoByCursor paginate `beforeCursor` and `afterCursor`", async () => {
      const result = await todoService.queryTodoByCursor({
        perPage: 1,
      });

      expect(result.beforeCursor).toBeNull();
      expect(typeof result.afterCursor).toBe("string");
      expect(result.data.length).toBe(1);

      const result2 = await todoService.queryTodoByCursor({
        perPage: 2,
        afterCursor: result.afterCursor,
      });

      expect(result2.data.length).toBe(2);
      expect(result2.beforeCursor).not.toBe(result.afterCursor);

      const result3 = await todoService.queryTodoByCursor({
        beforeCursor: result2.afterCursor,
      });

      console.log(
        result.beforeCursor,
        result.afterCursor,
        result2.beforeCursor,
        result2.afterCursor,
        result3.beforeCursor,
        result3.afterCursor
      );

      expect(result3.beforeCursor).toBeNull();

      expect(result3.data.length).toBe(3 - 1);
    });
  });
});
