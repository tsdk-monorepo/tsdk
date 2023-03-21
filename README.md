# tsdk-monorepo

## Commands

Prepare git hooks:

```
pnpm start-prepare
```

Publish `tsdk`/`tsdk-boilerplate` / `tsdk-server-adapters`packages:

```bash
pnpm start-publish
```

Build packages

```bash
pnpm build
```

Run examples:

Run the `examples/web`

```bash
# pnpm --filter server-example --filter web-example dev
pnpm dev:web-example
```

Run the `examples/mobile`

```bash
# pnpm --filter server-example --filter app-example dev
pnpm dev:app-example
```

Run the `examples/mobile` and `examples/web`

```bash
# pnpm --filter server-example --filter app-example --filter web-example dev
pnpm dev:app-web-example
```

Example docs:

```bash
# start docs
pnpm dev:docs
# build docs
pnpm build:docs
```

## 📁 Structure

- [`examples`](./examples) - Examples that only use packages and aren't aware of other apps.
- [`packages`](./packages) - Packages that may use external and/or other monorepo packages.

### Packages

- [`packages/tsdk`](./packages/tsdk) - `tsdk` package.
- [`packages/tsdk-server-adapters`](./packages/tsdk-server-adapters) - `tsdk-server-adapters` package.
- [`packages/tsdk-boilerplate`](./packages/tsdk-boilerplate) - `tsdk-boilerplate` package.

### Config Packages

- `configs/ts-config`
- `configs/eslint-config`
- `configs/test-config` pure typescript testing with `ts-mocha`
- `configs/vitest-config` vitest testing for react or others

### Examples

- [`examples/server`](./examples/server) - Node.js server using `packages/tsdk` and `packages/tsdk-server-adapters`packages.
- [`examples/server/packages/fe-sdk-demo`](./examples/server/packages/fe-sdk-demo) - fe-sdk
- [`examples/app`](./examples/app) - Expo app using `eslint-config` and `examples/server/packages/fe-sdk-demo` packages.
- [`examples/web`](./examples/web) - Next.js app using `eslint-config` and `examples/server/packages/fe-sdk-demo` packages.
