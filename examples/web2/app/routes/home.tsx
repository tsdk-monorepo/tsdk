import { useState, useEffect } from 'react';

import type { Route } from './+types/home';
import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes } from '../user-api';
import { Welcome } from '../welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [result, setResult] = useState<QueryTodoRes>();

  useEffect(() => {
    (async () => {
      await AddTodo({
        status: TodoStatus.todo,
        title: 'create by socket.io',
      });
      const res = await QueryTodo({});
      setResult(res);
    })();
  }, []);

  return (
    <>
      <Welcome />
      <div>{JSON.stringify(result)}</div>
    </>
  );
}
