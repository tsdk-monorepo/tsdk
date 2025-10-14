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
</style>
