---
id: 'modules_todo_apiconf_QueryTodoByCursor_apiconf'
title: 'Module: modules/todo/apiconf/QueryTodoByCursor.apiconf'
sidebar_label: 'modules/todo/apiconf/QueryTodoByCursor.apiconf'
custom_edit_url: null
---

## QueryTodoByCursor Type Aliases

### QueryTodoByCursorReq

Ƭ **QueryTodoByCursorReq**: `Pick`<[`Paging`](shared_paging.md#paging), `"beforeCursor"` \| `"afterCursor"` \| `"perPage"`\> & { `keyword?`: `string` }

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodoByCursor.apiconf.ts:22](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodoByCursor.apiconf.ts#L22)

---

### QueryTodoByCursorRes

Ƭ **QueryTodoByCursorRes**: `Omit`<[`PagingRes`](shared_paging.md#pagingres)<[`Todo`](../classes/modules_todo_Todo_entity.Todo.md)\>, `"page"` \| `"total"`\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodoByCursor.apiconf.ts:30](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodoByCursor.apiconf.ts#L30)

## QueryTodoByCursor Variables

### QueryTodoByCursorConfig

• `Const` **QueryTodoByCursorConfig**: [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md)

query todo list by cursor (APIConfig)

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodoByCursor.apiconf.ts:10](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodoByCursor.apiconf.ts#L10)
