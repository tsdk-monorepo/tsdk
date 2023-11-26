# Performance testing


Step 1: run servers

```sh
pnpm --filter=tsdk-bench start:all
```


Step 2: open new terminal, run bench

```sh
pnpm --filter=tsdk-bench bench
```