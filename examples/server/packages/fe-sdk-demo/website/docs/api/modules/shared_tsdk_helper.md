---
id: 'shared_tsdk_helper'
title: 'Module: shared/tsdk-helper'
sidebar_label: 'shared/tsdk-helper'
sidebar_position: 0
custom_edit_url: null
---

## References

### APIConfig

Re-exports [APIConfig](../interfaces/shared_tsdk_types.APIConfig.md)

---

### DeleteResult

Re-exports [DeleteResult](../classes/shared_tsdk_types.DeleteResult.md)

---

### InsertResult

Re-exports [InsertResult](../classes/shared_tsdk_types.InsertResult.md)

---

### ObjectLiteral

Re-exports [ObjectLiteral](../interfaces/shared_tsdk_types.ObjectLiteral.md)

---

### RequireAtLeastOne

Re-exports [RequireAtLeastOne](shared_tsdk_types.md#requireatleastone)

---

### RequireOnlyOne

Re-exports [RequireOnlyOne](shared_tsdk_types.md#requireonlyone)

---

### UpdateResult

Re-exports [UpdateResult](../classes/shared_tsdk_types.UpdateResult.md)

---

### trimAndRemoveUndefined

Re-exports [trimAndRemoveUndefined](shared_tsdk_types.md#trimandremoveundefined)

## Variables

### ProtocolTypes

• `Const` **ProtocolTypes**: `Object`

#### Type declaration

| Name       | Type     |
| :--------- | :------- |
| `request`  | `string` |
| `response` | `string` |
| `set`      | `string` |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts:18](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts#L18)

---

### hasBodyMethods

• `Const` **hasBodyMethods**: `Object`

#### Index signature

▪ [key: `string`]: `boolean` \| `undefined`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts:4](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts#L4)

## Functions

### checkMethodHasBody

▸ **checkMethodHasBody**(`method`): `undefined` \| `boolean`

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `method` | `string` |

#### Returns

`undefined` \| `boolean`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts:10](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts#L10)

---

### transformPath

▸ **transformPath**(`path`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts:14](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/tsdk-helper.ts#L14)
