import { useQueryTodo, useAddTodo } from './api/user-api-sveltequery';
import { createQuery } from '@tanstack/svelte-query';

useQueryTodo(
  {},
  {
    refetchOnWindowFocus: 'always',
    enabled: false,
  }
);
useAddTodo({
  onError: (e) => {
    //
  },
});

createQuery(() => ({
  queryKey: [],
  queryFn: () => {},
  refetchOnWindowFocus: 'always',
}));
