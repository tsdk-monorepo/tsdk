---
id: 'shared_tsdk_types.UpdateResult'
title: 'Class: UpdateResult'
sidebar_label: 'shared/tsdk-types.UpdateResult'
custom_edit_url: null
---

[shared/tsdk-types](../modules/shared_tsdk_types.md).UpdateResult

## Constructors

### constructor

• **new UpdateResult**()

## Properties

### affected

• `Optional` **affected**: `number`

Number of affected rows/documents
Not all drivers support this

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:76](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L76)

---

### generatedMaps

• **generatedMaps**: [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md)[]

Generated values returned by a database.
Has entity-like structure (not just column database name and values).

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:85](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L85)

---

### raw

• **raw**: `any`

Raw SQL result returned by executed query.

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:71](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L71)
