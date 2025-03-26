import { useState, useEffect } from 'react';

import { AddTodo, QueryTodo, TodoStatus, type QueryTodoRes, useQueryTodo } from '../user-api';
import { Welcome } from '../welcome/welcome';

export async function loader() {
  const res = await QueryTodo({});
  console.log('QueryTodo result:', res);
  return { res };
}

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [_result, setResult] = useState<QueryTodoRes>();
  const { data: result, mutate } = useQueryTodo({});
  useEffect(() => {
    (async () => {
      await AddTodo({
        status: TodoStatus.todo,
        title: 'create by socket.io',
      });
      mutate();
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
