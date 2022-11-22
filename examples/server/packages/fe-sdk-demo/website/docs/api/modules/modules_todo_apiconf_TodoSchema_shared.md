---
id: 'modules_todo_apiconf_TodoSchema_shared'
title: 'Module: modules/todo/apiconf/TodoSchema.shared'
sidebar_label: 'modules/todo/apiconf/TodoSchema.shared'
custom_edit_url: null
---

## Variables

### TodoSchema

• `Const` **TodoSchema**: `ZodObject`<{ `id`: `ZodEffects`<`ZodNumber`, `number`, `unknown`\> = IDSchema; `remark`: `ZodString` ; `status`: `ZodNativeEnum`<typeof [`TodoStatus`](../enums/modules_todo_Todo_entity.TodoStatus.md)\> ; `title`: `ZodString` }, `"strip"`, `ZodTypeAny`, { `id`: `number` = IDSchema; `remark`: `string` ; `status`: `TodoStatus` ; `title`: `string` }, { `id`: `unknown` = IDSchema; `remark`: `string` ; `status`: `TodoStatus` ; `title`: `string` }\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts:5](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts#L5)

---

### addTodoSchema

• `Const` **addTodoSchema**: `ZodObject`<{ `remark`: `ZodOptional`<`ZodString`\> ; `status`: `ZodNativeEnum`<typeof [`TodoStatus`](../enums/modules_todo_Todo_entity.TodoStatus.md)\> ; `title`: `ZodString` }, `"strip"`, `ZodTypeAny`, { `remark`: `undefined` \| `string` ; `status`: `TodoStatus` ; `title`: `string` }, { `remark`: `undefined` \| `string` ; `status`: `TodoStatus` ; `title`: `string` }\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts:18](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts#L18)

---

### deleteTodoSchema

• `Const` **deleteTodoSchema**: `ZodUnion`<[`ZodObject`<`Pick`<{ `id`: `ZodEffects`<`ZodNumber`, `number`, `unknown`\> = IDSchema; `remark`: `ZodString` ; `status`: `ZodNativeEnum`<typeof [`TodoStatus`](../enums/modules_todo_Todo_entity.TodoStatus.md)\> ; `title`: `ZodString` }, `"id"`\>, `"strip"`, `ZodTypeAny`, { `id`: `number` = IDSchema }, { `id`: `unknown` = IDSchema }\>, `ZodObject`<{ `IDs`: `ZodArray`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>, `"atleastone"`\> }, `"strip"`, `ZodTypeAny`, { `IDs`: [`number`, ...number[]] }, { `IDs`: [`unknown`, ...unknown[]] }\>]\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts:34](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts#L34)

---

### queryTodoByCursorSchema

• `Const` **queryTodoByCursorSchema**: `ZodObject`<`extendShape`<{ `afterCursor`: `ZodOptional`<`ZodString`\> ; `beforeCursor`: `ZodOptional`<`ZodString`\> ; `page`: `ZodOptional`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>\> ; `perPage`: `ZodOptional`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>\> }, { `keyword`: `ZodOptional`<`ZodString`\> }\>, `"strip"`, `ZodTypeAny`, { `afterCursor`: `undefined` \| `string` ; `beforeCursor`: `undefined` \| `string` ; `keyword`: `undefined` \| `string` ; `page`: `undefined` \| `number` ; `perPage`: `undefined` \| `number` }, { `afterCursor`: `undefined` \| `string` ; `beforeCursor`: `undefined` \| `string` ; `keyword`: `undefined` \| `string` ; `page`: `unknown` ; `perPage`: `unknown` }\> = `queryTodoSchema`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts:16](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts#L16)

---

### queryTodoSchema

• `Const` **queryTodoSchema**: `ZodObject`<`extendShape`<{ `afterCursor`: `ZodOptional`<`ZodString`\> ; `beforeCursor`: `ZodOptional`<`ZodString`\> ; `page`: `ZodOptional`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>\> ; `perPage`: `ZodOptional`<`ZodEffects`<`ZodNumber`, `number`, `unknown`\>\> }, { `keyword`: `ZodOptional`<`ZodString`\> }\>, `"strip"`, `ZodTypeAny`, { `afterCursor`: `undefined` \| `string` ; `beforeCursor`: `undefined` \| `string` ; `keyword`: `undefined` \| `string` ; `page`: `undefined` \| `number` ; `perPage`: `undefined` \| `number` }, { `afterCursor`: `undefined` \| `string` ; `beforeCursor`: `undefined` \| `string` ; `keyword`: `undefined` \| `string` ; `page`: `unknown` ; `perPage`: `unknown` }\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts:12](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts#L12)

---

### updateTodoSchema

• `Const` **updateTodoSchema**: `ZodEffects`<`ZodObject`<`extendShape`<{ `remark`: `ZodOptional`<`ZodString`\> ; `status`: `ZodOptional`<`ZodNativeEnum`<typeof [`TodoStatus`](../enums/modules_todo_Todo_entity.TodoStatus.md)\>\> ; `title`: `ZodOptional`<`ZodString`\> }, { `id`: `ZodEffects`<`ZodNumber`, `number`, `unknown`\> = IDSchema }\>, `"strip"`, `ZodTypeAny`, { `id`: `number` = IDSchema; `remark`: `undefined` \| `string` ; `status`: `undefined` \| [`todo`](../enums/modules_todo_Todo_entity.TodoStatus.md#todo) \| [`doing`](../enums/modules_todo_Todo_entity.TodoStatus.md#doing) \| [`completed`](../enums/modules_todo_Todo_entity.TodoStatus.md#completed) \| [`deleted`](../enums/modules_todo_Todo_entity.TodoStatus.md#deleted) ; `title`: `undefined` \| `string` }, { `id`: `unknown` = IDSchema; `remark`: `undefined` \| `string` ; `status`: `undefined` \| [`todo`](../enums/modules_todo_Todo_entity.TodoStatus.md#todo) \| [`doing`](../enums/modules_todo_Todo_entity.TodoStatus.md#doing) \| [`completed`](../enums/modules_todo_Todo_entity.TodoStatus.md#completed) \| [`deleted`](../enums/modules_todo_Todo_entity.TodoStatus.md#deleted) ; `title`: `undefined` \| `string` }\>, { `id`: `number` = IDSchema; `remark`: `undefined` \| `string` ; `status`: `undefined` \| [`todo`](../enums/modules_todo_Todo_entity.TodoStatus.md#todo) \| [`doing`](../enums/modules_todo_Todo_entity.TodoStatus.md#doing) \| [`completed`](../enums/modules_todo_Todo_entity.TodoStatus.md#completed) \| [`deleted`](../enums/modules_todo_Todo_entity.TodoStatus.md#deleted) ; `title`: `undefined` \| `string` }, { `id`: `unknown` = IDSchema; `remark`: `undefined` \| `string` ; `status`: `undefined` \| [`todo`](../enums/modules_todo_Todo_entity.TodoStatus.md#todo) \| [`doing`](../enums/modules_todo_Todo_entity.TodoStatus.md#doing) \| [`completed`](../enums/modules_todo_Todo_entity.TodoStatus.md#completed) \| [`deleted`](../enums/modules_todo_Todo_entity.TodoStatus.md#deleted) ; `title`: `undefined` \| `string` }\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts:24](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/modules/todo/apiconf/TodoSchema.shared.ts#L24)
