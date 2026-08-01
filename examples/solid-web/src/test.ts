import { useQueryTodo, useAddTodo } from './api/user-api-solidquery';
import { useQuery, type SolidQueryOptions, useMutation } from '@tanstack/solid-query';

const a: Omit<SolidQueryOptions, 'queryFn' | 'queryKey'> = {
  enabled: true,
};
const b: Omit<SolidQueryOptions, 'queryFn' | 'queryKey'> = {
  enabled: true,
};
console.log(a, b);

useQueryTodo(
  {},
  {
    refetchOnWindowFocus: 'always',
    enabled: true,
    initialData: {},
  }
);

useQuery(() => ({
  queryKey: [],
  queryFn: () => {},
  refetchOnWindowFocus: 'always',
  enabled: true,
}));

useMutation(() => ({
  async mutationFn() {
    return [];
  },
}));
useAddTodo({});
