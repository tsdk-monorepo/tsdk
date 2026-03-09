import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/swr-e2e', 'routes/swr-e2e.tsx'),
  route('/react-query-e2e', 'routes/react-query-e2e.tsx'),
] satisfies RouteConfig;
