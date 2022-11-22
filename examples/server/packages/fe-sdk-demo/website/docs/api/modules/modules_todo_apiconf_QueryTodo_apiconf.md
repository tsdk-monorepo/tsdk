---
id: 'modules_todo_apiconf_QueryTodo_apiconf'
title: 'Module: modules/todo/apiconf/QueryTodo.apiconf'
sidebar_label: 'modules/todo/apiconf/QueryTodo.apiconf'
custom_edit_url: null
---

## Type Aliases

### QueryTodoReq

Ƭ **QueryTodoReq**: `Pick`<[`Paging`](shared_paging.md#paging), `"page"` \| `"perPage"`\> & { `keyword?`: `string` }

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodo.apiconf.ts:15](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodo.apiconf.ts#L15)

---

### QueryTodoRes

Ƭ **QueryTodoRes**: `Omit`<[`PagingRes`](shared_paging.md#pagingres)<[`Todo`](../classes/modules_todo_Todo_entity.Todo.md)\>, `"beforeCursor"` \| `"afterCursor"`\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodo.apiconf.ts:19](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodo.apiconf.ts#L19)

## Variables

### QueryTodoConfig

• `Const` **QueryTodoConfig**: [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md)

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodo.apiconf.ts:5](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/QueryTodo.apiconf.ts#L5)
