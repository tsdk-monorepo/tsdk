---
id: 'user_api'
title: 'Module: user-api'
sidebar_label: 'user-api'
sidebar_position: 0
custom_edit_url: null
---

## others Functions

### QueryTodoByCursor

▸ **QueryTodoByCursor**(`data`, `requestConfig?`, `needTrim?`): `Promise`<[`QueryTodoByCursorRes`](modules_todo_apiconf_QueryTodoByCursor_apiconf.md#querytodobycursorres)\>

query todo list by cursor

#### Parameters

| Name             | Type                                                                                                                                                                                                                |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data`           | [`QueryTodoByCursorReq`](modules_todo_apiconf_QueryTodoByCursor_apiconf.md#querytodobycursorreq)                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<[`QueryTodoByCursorReq`](modules_todo_apiconf_QueryTodoByCursor_apiconf.md#querytodobycursorreq)\> |
| `needTrim?`      | `boolean`                                                                                                                                                                                                           |

#### Returns

`Promise`<[`QueryTodoByCursorRes`](modules_todo_apiconf_QueryTodoByCursor_apiconf.md#querytodobycursorres)\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:43](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L43)

---

## todo Functions

### AddTodo

▸ **AddTodo**(`data`, `requestConfig?`, `needTrim?`): `Promise`<[`InsertResult`](../classes/shared_tsdk_types.InsertResult.md)\>

add todo

#### Parameters

| Name             | Type                                                                                                                                                                                  |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data`           | [`AddTodoReq`](modules_todo_apiconf_AddTodo_apiconf.md#addtodoreq)                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<[`AddTodoReq`](modules_todo_apiconf_AddTodo_apiconf.md#addtodoreq)\> |
| `needTrim?`      | `boolean`                                                                                                                                                                             |

#### Returns

`Promise`<[`InsertResult`](../classes/shared_tsdk_types.InsertResult.md)\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:43](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L43)

---

### DeleteTodo

▸ **DeleteTodo**(`data`, `requestConfig?`, `needTrim?`): `Promise`<[`DeleteResult`](../classes/shared_tsdk_types.DeleteResult.md)\>

delete todo

#### Parameters

| Name             | Type                                                                                                                                                                                           |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`           | [`DeleteTodoReq`](modules_todo_apiconf_DeleteTodo_apiconf.md#deletetodoreq)                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<[`DeleteTodoReq`](modules_todo_apiconf_DeleteTodo_apiconf.md#deletetodoreq)\> |
| `needTrim?`      | `boolean`                                                                                                                                                                                      |

#### Returns

`Promise`<[`DeleteResult`](../classes/shared_tsdk_types.DeleteResult.md)\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:43](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L43)

---

### QueryTodo

▸ **QueryTodo**(`data`, `requestConfig?`, `needTrim?`): `Promise`<[`QueryTodoRes`](modules_todo_apiconf_QueryTodo_apiconf.md#querytodores)\>

query todo

#### Parameters

| Name             | Type                                                                                                                                                                                        |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data`           | [`QueryTodoReq`](modules_todo_apiconf_QueryTodo_apiconf.md#querytodoreq)                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<[`QueryTodoReq`](modules_todo_apiconf_QueryTodo_apiconf.md#querytodoreq)\> |
| `needTrim?`      | `boolean`                                                                                                                                                                                   |

#### Returns

`Promise`<[`QueryTodoRes`](modules_todo_apiconf_QueryTodo_apiconf.md#querytodores)\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:43](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L43)

---

### UpdateTodo

▸ **UpdateTodo**(`data`, `requestConfig?`, `needTrim?`): `Promise`<[`UpdateResult`](../classes/shared_tsdk_types.UpdateResult.md)\>

update todo

#### Parameters

| Name             | Type                                                                                                                                                                                           |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`           | [`UpdateTodoReq`](modules_todo_apiconf_UpdateTodo_apiconf.md#updatetodoreq)                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<[`UpdateTodoReq`](modules_todo_apiconf_UpdateTodo_apiconf.md#updatetodoreq)\> |
| `needTrim?`      | `boolean`                                                                                                                                                                                      |

#### Returns

`Promise`<[`UpdateResult`](../classes/shared_tsdk_types.UpdateResult.md)\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:43](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L43)
