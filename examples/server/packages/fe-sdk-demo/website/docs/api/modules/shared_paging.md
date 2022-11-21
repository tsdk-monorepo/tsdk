---
id: 'shared_paging'
title: 'Module: shared/paging'
sidebar_label: 'shared/paging'
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

### Paging

Ƭ **Paging**: `Object`

#### Type declaration

| Name            | Type     |
| :-------------- | :------- |
| `afterCursor?`  | `string` |
| `beforeCursor?` | `string` |
| `page?`         | `number` |
| `perPage?`      | `number` |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/paging.ts:10](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/paging.ts#L10)

---

### PagingRes

Ƭ **PagingRes**<`Entity`\>: [`Paging`](shared_paging.md#paging) & { `data`: `Entity`[] ; `total`: `number` }

#### Type parameters

| Name     |
| :------- |
| `Entity` |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/paging.ts:17](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/paging.ts#L17)

## Variables

### pageSchema

• `Const` **pageSchema**: `ZodObject`<{ `afterCursor`: `ZodOptional`<`ZodString`\> ; `beforeCursor`: `ZodOptional`<`ZodString`\> ; `page`: `ZodOptional`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>\> ; `perPage`: `ZodOptional`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>\> }, `"strip"`, `ZodTypeAny`, { `afterCursor`: `undefined` \| `string` ; `beforeCursor`: `undefined` \| `string` ; `page`: `undefined` \| `number` ; `perPage`: `undefined` \| `number` }, { `afterCursor`: `undefined` \| `string` ; `beforeCursor`: `undefined` \| `string` ; `page`: `unknown` ; `perPage`: `unknown` }\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/shared/paging.ts:3](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/shared/paging.ts#L3)
