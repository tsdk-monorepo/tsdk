---
id: 'shared_tsdk_types.APIConfig'
title: 'Interface: APIConfig'
sidebar_label: 'shared/tsdk-types.APIConfig'
custom_edit_url: null
---

[shared/tsdk-types](../modules/shared_tsdk_types.md).APIConfig

## Properties

### category

• `Optional` **category**: `string`

The API category

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:19](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L19)

---

### description

• **description**: `string`

The API description

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:17](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L17)

---

### disabled

• `Optional` **disabled**: `boolean`

The API disabled? Default is false

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:15](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L15)

---

### headers

• `Optional` **headers**: `Object`

custom headers for client

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:22](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L22)

---

### method

• **method**: `"get"` \| `"post"` \| `"head"` \| `"put"` \| `"delete"` \| `"options"` \| `"patch"`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:9](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L9)

---

### name

• **name**: `string`

The API name

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:6](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L6)

---

### needAuth

• `Optional` **needAuth**: `boolean`

The API need auth? Default is false

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:13](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L13)

---

### path

• **path**: `string`

The API path

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:8](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L8)

---

### schema

• `Optional` **schema**: `ZodTypeAny`

Request data validate scheme

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:11](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L11)

---

### type

• **type**: `string`

The API type. Like: user side or admin side, required.

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:4](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L4)
