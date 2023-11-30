<div align="center">
  <a href="https://tsdk.dev">
  <h1>tsdk</h1>
  </a>
  <p>Type-safe API development and code share tool for TypeScript projects.</p>
</div>

![!Run on Windows](https://github.com/tsdk-monorepo/tsdk/actions/workflows/linux-ci.yml/badge.svg?event=push)
![Run on Linux](https://github.com/tsdk-monorepo/tsdk/actions/workflows/windows-ci.yml/badge.svg?event=push)
[![NPM version](https://badge.fury.io/js/tsdk.svg)](https://www.npmjs.com/package/tsdk)
[![install size](https://packagephobia.com/badge?p=tsdk)](https://packagephobia.com/result?p=tsdk)
![Downloads](https://img.shields.io/npm/dm/tsdk.svg?style=flat)

## Features

`tsdk` is a tool for TypeScript projects:

- Share code easy between projects.
- End-to-end typesafe APIs development.
- Support `@nestjs/cli` bundle into one single file.
- Built-in docs.

**Note: `@nestjs/cli` bundle into one single file, but not include `node_modules/*`**

## Website

https://tsdk.dev

[中文](https://tsdk.dev/zh-CN)

## Documentation

https://tsdk.dev/docs/intro

### Install

```bash
npm i tsdk
```

### Usage

```bash
npx tsdk --init
```

```bash
npx tsdk --sync
```

```bash
# keep the files don't overwrite by sync
npx tsdk --sync --no-overwrite
```

Support `@nestjs/cli` bundle project to one single file:

```bash
# bundle default project
npx tsdk --nest build
# bundle all projects
npx tsdk --nest build all
# bundle multiple projects in `nest-cli.json`
npx tsdk --nest build nameA nameB nameC
```
