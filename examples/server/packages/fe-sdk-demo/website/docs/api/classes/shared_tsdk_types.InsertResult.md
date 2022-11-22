---
id: 'shared_tsdk_types.InsertResult'
title: 'Class: InsertResult'
sidebar_label: 'shared/tsdk-types.InsertResult'
custom_edit_url: null
---

[shared/tsdk-types](../modules/shared_tsdk_types.md).InsertResult

Result object returned by InsertQueryBuilder execution.

## Constructors

### constructor

• **new InsertResult**()

## Properties

### generatedMaps

• **generatedMaps**: [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md)[]

Generated values returned by a database.
Has entity-like structure (not just column database name and values).

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:60](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L60)

---

### identifiers

• **identifiers**: [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md)[]

Contains inserted entity id.
Has entity-like structure (not just column database name and values).

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:55](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L55)

---

### raw

• **raw**: `any`

Raw SQL result returned by executed query.

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:64](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L64)
