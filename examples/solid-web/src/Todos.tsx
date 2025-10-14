import { createSignal, createMemo, For } from 'solid-js';
import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes } from './api/user-api';
import { useQueryTodo, useAddTodo, useDeleteTodo, setupUserApi } from './api/user-api-solidquery';

// Setup user API
setupUserApi();

function TodoComponent() {
  // State
  const [enabled, setEnabled] = createSignal(true);

  // Mutations and queries
  const addTodoMutation = useAddTodo();
  const deleteTodoMutation = useDeleteTodo();
  const todosQuery = useQueryTodo({}, () => ({
    refetchOnWindowFocus: 'always',
    staleTime: 0,
    get enabled() {
      return enabled();
    },
  }));

  // Computed
  const dataList = createMemo(() => todosQuery.data?.data || []);

  // Methods
  const handleAddTodo = () => {
    addTodoMutation.mutate({
      title: 'This is test',
      status: TodoStatus.todo,
    });
  };

  const handleDeleteTodo = () => {
    const list = dataList();
    if (list?.[0]) {
      deleteTodoMutation.mutate({ id: list[0].id });
    }
  };

  const handleDeleteAllTodos = async () => {
    const list = dataList();
    if (list) {
      await Promise.all(
        list.map((item) => {
          return deleteTodoMutation.mutateAsync({ id: item.id });
        })
      );
    }
    todosQuery.refetch();
  };

  const handleQueryTodo = () => {
    if (enabled()) todosQuery.refetch();
  };

  const toggleEnabled = () => {
    setEnabled(!enabled());
  };

  const handleDeleteItem = (id: number) => {
    deleteTodoMutation.mutate({ id });
    // Note: Solid Query will typically handle refetching automatically
    // based on your query invalidation settings, but you can manually refetch:
    todosQuery.refetch();
  };

  return (
    <div>
      <div class="space-x-2">
        <button class="p-2 border rounded-lg mr-2" id="add-todo" onClick={handleAddTodo}>
          Add todo
        </button>
        <button class="p-2 border rounded-lg mr-2" id="delete-todo" onClick={handleDeleteTodo}>
          Delete todo
        </button>
        <button
          class="p-2 border rounded-lg mr-2"
          id="delete-all-todos"
          onClick={handleDeleteAllTodos}>
          Delete All Todos
        </button>
        <button class="p-2 border rounded-lg mr-2" id="query-todo" onClick={handleQueryTodo}>
          Query todo
        </button>
        <button class="p-2 border rounded-lg mr-2" id="toggle-enabled" onClick={toggleEnabled}>
          toggle enabled
        </button>
      </div>

      <div id="todo-list">
        <For each={dataList()}>
          {(item) => (
            <div class="todo-item">
              {item.id}.{item.title}
              <button class="p-2 border rounded-lg mr-2" onClick={() => handleDeleteItem(item.id)}>
                x
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default TodoComponent;
