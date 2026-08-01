import { useState } from 'react';

import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes } from '../user-api';
import { useQueryTodo, useAddTodo, useDeleteTodo, setupUserApi } from '~/user-api-swr';

export async function loader() {
  const res = await QueryTodo({});
  return { res };
}

export function meta() {
  return [
    { title: 'React Router Page for SWR hooks tests' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

setupUserApi();

export default function SWRE2EPage() {
  const [enabled, setEnabled] = useState(true);

  const { trigger: addTodo, ...addTodoRes } = useAddTodo({});
  const { trigger: deleteTodo, ...deleteTodoRes } = useDeleteTodo({});
  const { data, mutate: refreshTodos } = useQueryTodo(enabled ? {} : undefined, {
    revalidateOnFocus: true,
    focusThrottleInterval: 100,
    dedupingInterval: 100,
  });

  const dataList = data?.data || [];

  return (
    <div>
      <div className="space-x-2">
        <button
          className="p-2 border rounded-lg mr-2"
          id="add-todo"
          onClick={() => {
            addTodo({
              title: 'This is test',
              status: TodoStatus.todo,
            });
          }}>
          Add todo
        </button>
        <button
          className="p-2 border rounded-lg mr-2"
          id="delete-todo"
          onClick={() => {
            if (dataList?.[0]) deleteTodo({ id: dataList[0].id });
          }}>
          Delete todo
        </button>
        <button
          className="p-2 border rounded-lg mr-2"
          id="delete-all-todos"
          onClick={async () => {
            if (dataList) {
              await Promise.all(
                dataList.map((item) => {
                  return deleteTodo({ id: item.id });
                })
              );
            }
            refreshTodos();
          }}>
          Delete All Todos
        </button>
        <button
          className="p-2 border rounded-lg mr-2"
          id="query-todo"
          onClick={() => {
            refreshTodos();
          }}>
          Query todo
        </button>
        <button
          className="p-2 border rounded-lg mr-2"
          id="toggle-enabled"
          onClick={() => setEnabled(!enabled)}>
          toggle enabled
        </button>
      </div>

      <div id="todo-list">
        {dataList.map((item) => {
          return (
            <div key={`todo-${item.id}`} className="todo-item">
              {item.id}.{item.title}{' '}
              <button
                className="p-2 border rounded-lg mr-2"
                onClick={() => deleteTodo({ id: item.id }).then(() => refreshTodos())}>
                x
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
