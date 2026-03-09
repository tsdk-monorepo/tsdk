import { useState } from 'react';

import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes } from '../user-api';
import { useQueryTodo, useAddTodo, useDeleteTodo, setupUserApi } from '~/user-api-reactquery';

export async function loader() {
  const res = await QueryTodo({});
  return { res };
}

export function meta() {
  return [
    { title: 'React Router Page for @tanstack/react-query hooks tests' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

setupUserApi();

export default function ReactQueryE2EPage() {
  const [enabled, setEnabled] = useState(true);

  const { mutateAsync: addTodo, ...addTodoRes } = useAddTodo({});
  const { mutateAsync: deleteTodo, ...deleteTodoRes } = useDeleteTodo({});
  const { data, refetch: refreshTodos } = useQueryTodo(
    {},
    {
      refetchOnWindowFocus: 'always',
      staleTime: 0,
      enabled,
    }
  );

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
            if (enabled) refreshTodos();
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
