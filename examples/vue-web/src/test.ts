import { useQueryTodo, useDeleteTodo } from './user-api-vuequery';
import { useQuery } from '@tanstack/vue-query';

useQueryTodo(
  {},
  {
    refetchOnWindowFocus: 'always',
    enabled: false,
  }
);

useDeleteTodo({
  onError: (e) => {
    //
  },
});

useQuery({
  queryKey: [],
  queryFn: () => {},
  refetchOnWindowFocus: 'always',
});
