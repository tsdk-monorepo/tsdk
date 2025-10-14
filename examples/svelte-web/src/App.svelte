<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import SvelteQueryE2E from './QueryE2E.svelte'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import { getQueryClient } from './api/svelte-query-provider';
  const queryClient = getQueryClient();
</script>
<main>
<QueryClientProvider client={queryClient}>

<SvelteQueryE2E />
</QueryClientProvider>

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
