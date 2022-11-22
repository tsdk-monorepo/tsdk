---
id: 'socket_io'
title: 'Module: socket.io'
sidebar_label: 'socket.io'
custom_edit_url: null
---

## Functions

### getSocketIOInstance

▸ **getSocketIOInstance**(): `Socket`<`DefaultEventsMap`, `DefaultEventsMap`\>

Get socket.io-client instance

#### Returns

`Socket`<`DefaultEventsMap`, `DefaultEventsMap`\>

The io

#### Defined in

[examples/server/packages/fe-sdk-demo/src/socket.io.ts:42](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/socket.io.ts#L42)

---

### setSocketIOInstance

▸ **setSocketIOInstance**(`instance`): `void`

Set the io

#### Parameters

| Name       | Type                                              | Description |
| :--------- | :------------------------------------------------ | :---------- |
| `instance` | `Socket`<`DefaultEventsMap`, `DefaultEventsMap`\> | io          |

#### Returns

`void`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/socket.io.ts:17](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/socket.io.ts#L17)

---

### socketIOHandler

▸ **socketIOHandler**(`apiConfig`, `data`, `requestConfig?`, `needTrim?`): `Promise`<`any`\>

#### Parameters

| Name             | Type                                                                                           |
| :--------------- | :--------------------------------------------------------------------------------------------- |
| `apiConfig`      | [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md)                                    |
| `data`           | `any`                                                                                          |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) & { `timeout?`: `number` } |
| `needTrim?`      | `boolean`                                                                                      |

#### Returns

`Promise`<`any`\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/socket.io.ts:50](https://github.com/jiouiuw/tsdk-monorepo/blob/f48ea35/examples/server/packages/fe-sdk-demo/src/socket.io.ts#L50)
