<script setup lang="ts">
import { ref, computed } from 'vue';
import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes } from './user-api';
import { useQueryTodo, useAddTodo, useDeleteTodo, setupUserApi } from './user-api-vuequery';

// Setup user API
setupUserApi();

// State
const enabled = ref(true);

// Mutations and queries
const { mutateAsync: addTodo, ...addTodoRes } = useAddTodo({});
const { mutateAsync: deleteTodo, ...deleteTodoRes } = useDeleteTodo({});
const { data, refetch: refreshTodos } = useQueryTodo(
  {},
  {
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled,
  }
);

// Computed
const dataList = computed(() => data.value?.data || []);

// Methods
const handleAddTodo = () => {
  addTodo({
    title: 'This is test',
    status: TodoStatus.todo,
  });
};

const handleDeleteTodo = () => {
  if (dataList.value?.[0]) {
    deleteTodo({ id: dataList.value[0].id });
  }
};

const handleDeleteAllTodos = async () => {
  if (dataList.value) {
    await Promise.all(
      dataList.value.map((item) => {
        return deleteTodo({ id: item.id });
      })
    );
  }
  refreshTodos();
};

const handleQueryTodo = () => {
  if (enabled.value) refreshTodos();
};

const toggleEnabled = () => {
  enabled.value = !enabled.value;
};

const handleDeleteItem = (id: number) => {
  deleteTodo({ id }).then(() => refreshTodos());
};
</script>

<template>
  <div>
    <div class="space-x-2">
      <button class="p-2 border rounded-lg mr-2" id="add-todo" @click="handleAddTodo">
        Add todo
      </button>
      <button class="p-2 border rounded-lg mr-2" id="delete-todo" @click="handleDeleteTodo">
        Delete todo
      </button>
      <button
        class="p-2 border rounded-lg mr-2"
        id="delete-all-todos"
        @click="handleDeleteAllTodos">
        Delete All Todos
      </button>
      <button class="p-2 border rounded-lg mr-2" id="query-todo" @click="handleQueryTodo">
        Query todo
      </button>
      <button class="p-2 border rounded-lg mr-2" id="toggle-enabled" @click="toggleEnabled">
        toggle enabled
      </button>
    </div>

    <div id="todo-list">
      <div v-for="item in dataList" :key="`todo-${item.id}`" class="todo-item">
        {{ item.id }}.{{ item.title }}
        <button class="p-2 border rounded-lg mr-2" @click="handleDeleteItem(item.id)">x</button>
      </div>
    </div>
  </div>
</template>
