import { useState, useEffect } from 'react';

import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes, useQueryTodo } from '../user-api';
import { Welcome } from '../welcome/welcome';
import {
  AddTodo as _AddTodo,
  QueryTodo as _QueryTodo,
  useQueryTodo as useQueryTodo_,
} from '../user-api.sender';

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [_result, setResult] = useState<QueryTodoRes>();
  const { data: result, mutate } = useQueryTodo({});

  const [_result2, setResult2] = useState<QueryTodoRes>();
  const { data: result2, mutate: mutate2, isLoading, error } = useQueryTodo_({});
  useEffect(() => {
    (async () => {
      await AddTodo({
        status: TodoStatus.todo,
        title: 'create by socket.io',
      });
      mutate();
      // const res = await QueryTodo({});
      // setResult(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await _AddTodo({
        status: TodoStatus.todo,
        title: 'create by socket.io',
      });
      mutate2();
      // const res = await _QueryTodo({});
      // setResult2(res);
    })();
  }, []);

  return (
    <>
      <Welcome />
      <h2>Main thread</h2>
      <div>{JSON.stringify(result)}</div>
      <hr />

      <h2>Worker</h2>
      <div>{JSON.stringify(result2)}</div>
    </>
  );
}
