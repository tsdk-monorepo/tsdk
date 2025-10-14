<script lang="ts">
  import { writable, get } from 'svelte/store';
  import {
    TodoStatus,
    useQueryTodo,
    useAddTodo,
    useDeleteTodo,
    setupUserApi
  } from './api/user-api-sveltequery';

  setupUserApi();

  const enabled = writable(true);

  const { mutateAsync: addTodo } = useAddTodo({});
  const { mutateAsync: deleteTodo } = useDeleteTodo({});

  // query object
  const query = useQueryTodo(
    {},
    {
      refetchOnWindowFocus: 'always',
      staleTime: 0,
      enabled: () => get(enabled),
    }
  );

  // Debug: Let's see what query actually is
  // console.log('Query object:', query);
  // console.log('Query keys:', Object.keys(query));
  // console.log('Query.data type:', typeof query.data);
  
  // Try accessing as a derived store or reactive value
  let queryState = query;

  const handleAddTodo = async () => {
    await addTodo({ title: 'This is test', status: TodoStatus.todo });
    // queryState.refetch?.();
  };

  const handleDeleteTodo = async () => {
    const list = queryState.data?.data || [];
    if (list[0]) {
      await deleteTodo({ id: list[0].id });
      // queryState.refetch?.();
    }
  };

  const handleDeleteAllTodos = async () => {
    const list = queryState.data?.data || [];
    if (list.length) {
      await Promise.all(list.map((item) => deleteTodo({ id: item.id })));
      queryState.refetch?.();
    }
  };

  const handleQueryTodo = () => {
    if (get(enabled)) queryState.refetch?.();
  };

  const toggleEnabled = () => {
    enabled.update((v) => !v);
  };

  const handleDeleteItem = async (id: string | number) => {
    await deleteTodo({ id });
    // queryState.refetch?.();
  };
</script>

<div>
  <div>
    {#if queryState.isLoading}
      <p>Loading...</p>
    {:else if queryState.isError}
      <p>Error: {queryState.error?.message}</p>
    {:else if queryState.isSuccess}
      {#each queryState.data?.data || [] as todo (todo.id)}
        <p>{todo.title}</p>
      {/each}
    {/if}
  </div>
  
  <div class="space-x-2">
    <button id="add-todo" class="p-2 border rounded-lg mr-2" on:click={handleAddTodo}>Add todo</button>
    <button id="delete-todo" class="p-2 border rounded-lg mr-2" on:click={handleDeleteTodo}>Delete todo</button>
    <button id="delete-all-todos" class="p-2 border rounded-lg mr-2" on:click={handleDeleteAllTodos}>Delete All Todos</button>
    <button id="query-todo" class="p-2 border rounded-lg mr-2" on:click={handleQueryTodo}>Query todo</button>
    <button id="toggle-enabled" class="p-2 border rounded-lg mr-2" on:click={toggleEnabled}>toggle enabled</button>
  </div>

  <div id="todo-list">
    {#each queryState.data?.data || [] as item (item.id)}
      <div class="todo-item">
        {item.id}.{item.title}
        <button class="p-2 border rounded-lg mr-2" on:click={() => handleDeleteItem(item.id)}>x</button>
      </div>
    {/each}
  </div>
</div>