---
id: 'shared_tsdk_types'
title: 'Module: shared/tsdk-types'
sidebar_label: 'shared/tsdk-types'
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [DeleteResult](../classes/shared_tsdk_types.DeleteResult.md)
- [InsertResult](../classes/shared_tsdk_types.InsertResult.md)
- [UpdateResult](../classes/shared_tsdk_types.UpdateResult.md)

## Interfaces

- [APIConfig](../interfaces/shared_tsdk_types.APIConfig.md)
- [ObjectLiteral](../interfaces/shared_tsdk_types.ObjectLiteral.md)

## Type Aliases

### RequireAtLeastOne

Ƭ **RequireAtLeastOne**<`T`\>: { [K in keyof T]-?: Required<Pick<T, K\>\> & Partial<Pick<T, Exclude<keyof T, K\>\>\> }[keyof `T`]

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:103](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L103)

---

### RequireOnlyOne

Ƭ **RequireOnlyOne**<`T`, `Keys`\>: `Pick`<`T`, `Exclude`<keyof `T`, `Keys`\>\> & { [K in Keys]-?: Required<Pick<T, K\>\> & Partial<Record<Exclude<Keys, K\>, undefined\>\> }[`Keys`]

#### Type parameters

| Name   | Type                          |
| :----- | :---------------------------- |
| `T`    | `T`                           |
| `Keys` | extends keyof `T` = keyof `T` |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:107](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L107)

## Functions

### trimAndRemoveUndefined

▸ **trimAndRemoveUndefined**(`data`): [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md)

remove undefined field or trim string value

#### Parameters

| Name   | Type                                                                | Description     |
| :----- | :------------------------------------------------------------------ | :-------------- |
| `data` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) | the object data |

#### Returns

[`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md)

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts:30](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/tsdk-types.ts#L30)
