---
id: 'shared_utils'
title: 'Module: shared/utils'
sidebar_label: 'shared/utils'
sidebar_position: 0
custom_edit_url: null
---

## Variables

### IDSchema

• `Const` **IDSchema**: `ZodEffects`<`ZodNumber`, `number`, `unknown`\> = `PositiveNumberSchema`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/utils.ts:24](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/utils.ts#L24)

---

### PositiveNumberSchema

• `Const` **PositiveNumberSchema**: `ZodEffects`<`ZodNumber`, `number`, `unknown`\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/utils.ts:17](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/utils.ts#L17)

## Functions

### sleep

▸ **sleep**(`ms`): `Promise`<`unknown`\>

promisify `setTimeout`

#### Parameters

| Name | Type     | Description |
| :--- | :------- | :---------- |
| `ms` | `number` | number      |

#### Returns

`Promise`<`unknown`\>

Promise any

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/utils.ts:15](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/utils.ts#L15)

---

### sum

▸ **sum**(`a`, `b`): `number`

Math sum

#### Parameters

| Name | Type     | Description |
| :--- | :------- | :---------- |
| `a`  | `number` | number      |
| `b`  | `number` | number      |

#### Returns

`number`

number

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/utils.ts:8](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/shared/utils.ts#L8)
