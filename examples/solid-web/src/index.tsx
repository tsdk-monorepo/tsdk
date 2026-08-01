/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/solid-query';
import { getQueryClient } from './api/solid-query-provider.ts';

const root = document.getElementById('root');

render(
  () => (
    <QueryClientProvider client={getQueryClient()}>
      <App />
    </QueryClientProvider>
  ),
  root!
);
