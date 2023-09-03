# Changelog

This is the log of notable changes to the `tsdk` that are developer-facing.

### 📚 3rd party library updates

### 🛠 Breaking changes

### 🎉 New features

### 🐛 Bug fixes

### 💡 Others

### 0.0.19-beta.4

2022/11/07

- `tsdk-server-adapters`'s `getReqInfo` support Promise function

### 0.0.19-beta.5

2022/11/12

- `tsdk` export `permissions.json` with organize structure

2022/11/22

- `tsdk` support APIs SDK Docs export

### 0.0.19-beta.6

2022/11/23

- fix broken for old `tsdk` project

### 0.0.19-beta.7

2023/1/23

- Generate and change `fe-sdk docs` name, fix confilict in dev.
- Skip `tsdk-types.ts` import in shared index, fix type dulicaped error.

### 0.0.19-beta.8

2023/1/23

- `fe-sdk` throw custom error

### 0.0.19-beta.9

2023/2/1

- Support `kysely`
- Fix some bugs

### 0.0.19-beta.10

2023/2/5

- Fix socket.io getID wrong method logic
- Refactor getID logic

### 0.0.19-beta.11

2023/2/8

- Ignore commented import string warn, because it's commented
- Fix windows build

### 0.0.19-beta.12

2023/2/9

- Sort files before export content to avoid repeat files change

### 0.0.19-beta.13

2023/2/13

- socket.io protocol methods use index to save data transfer

2023/2/15

- Sync overwrite with fe-sdk-template files and you should not change files by generate tsdk, but you can create custom files. You can pass tsdk --sync --no-overwrite keep old behavior(but don't recommend.)
- Monorepo: seperate `@acme/test-config` as a package could share buy others

2023/2/16

- `@acme/ts-config`, `@acme/eslint-config`, `@acme/test-config` move to `configs/` from `/packages` and change the prefix from `@acme/` to `@configs/`

### 0.0.19-beta.14

2023/3/23

- bump webpack version

2023/4/18

- bump deps

### 0.0.19-beta.15

2023/5/16

- fix: `_id` overwrite by data with property `_id`
- fix: when request params is not object wrong data

### 0.0.19-beta.16

2023/5/16

- fix: `trimAndRemoveUndefined` should only for object (not array and null) data

2023/7/17

- bump deps

### 0.0.20-beta.0

2023/7/31

- bump deps
- add honojs support

### 0.0.20-beta.1

2023/9/3

- bump deps

### 0.0.20-beta.2

- typedoc don't support typescript@5.2, fix to 5.1.6
