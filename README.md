<p align="center">
  <a href="https://tsdk.dev">
      <img  src="./website/public/tsdk.jpeg" width="300" alt="tsdk" />
  </a>
</p>

<div align="center">
  <p>Type-safe API development and code share tool for TypeScript projects.</p>
</div>

![!Run on Windows](https://github.com/tsdk-monorepo/tsdk/actions/workflows/linux-ci.yml/badge.svg?event=push)
![Run on Linux](https://github.com/tsdk-monorepo/tsdk/actions/workflows/windows-ci.yml/badge.svg?event=push)
[![NPM version](https://badge.fury.io/js/tsdk.svg)](https://www.npmjs.com/package/tsdk)
[![install size](https://packagephobia.com/badge?p=tsdk)](https://packagephobia.com/result?p=tsdk)
![Downloads](https://img.shields.io/npm/dm/tsdk.svg?style=flat)

## Getting Started

Visit <a aria-label="tsdk intro" href="https://tsdk.dev/docs/intro">https://tsdk.dev/docs/intro</a> to get started with tsdk.

## Website

https://tsdk.dev

[中文](https://tsdk.dev/zh-CN)

## Documentation

https://tsdk.dev/docs/intro

## Development

This repository uses [PNPM Workspaces](https://pnpm.io/workspaces) and
[Turborepo](https://github.com/vercel/turborepo).

Install dependencies:

```sh
pnpm install
```

### Structure

- [`packages/tsdk`](./packages/tsdk) - `tsdk` package.
- [`packages/tsdk-server-adapters`](./packages/tsdk-server-adapters) - `tsdk-server-adapters` package.
- [`packages/bench`](./packages/bench) - `tsdk` benchmark.
- [`configs/*`](./packages/bench) - config packages for ts/eslint/test etc.
- [`examples/*`](./examples) - Examples that only use packages and aren't aware of other apps.

## Community

Welcome to join the [Discussions](https://github.com/tsdk-monorepo/tsdk/discussions)
