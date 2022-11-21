---
id: 'gen_api'
title: 'Module: gen-api'
sidebar_label: 'gen-api'
sidebar_position: 0
custom_edit_url: null
---

## Functions

### default

▸ **default**<`ReqPayload`, `ResData`\>(`apiConfig`): (`data`: `ReqPayload`, `requestConfig?`: [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<`ReqPayload`\>, `needTrim?`: `boolean`) => `Promise`<`ResData`\>

Generate API

**`Example`**

```ts
const apiDemo = genApi<ApiDemoReqPayload, ApiDemoResData>(ApiDemoConfig);
```

#### Type parameters

| Name         |
| :----------- |
| `ReqPayload` |
| `ResData`    |

#### Parameters

| Name        | Type                                                        | Description |
| :---------- | :---------------------------------------------------------- | :---------- |
| `apiConfig` | [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md) | APIConfig   |

#### Returns

`fn`

▸ (`data`, `requestConfig?`, `needTrim?`): `Promise`<`ResData`\>

##### Parameters

| Name             | Type                                                                                                                            |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `data`           | `ReqPayload`                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<`ReqPayload`\> |
| `needTrim?`      | `boolean`                                                                                                                       |

##### Returns

`Promise`<`ResData`\>

| Name     | Type                                                        |
| :------- | :---------------------------------------------------------- |
| `config` | [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md) |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:40](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L40)

---

### getHandler

▸ **getHandler**(): (`apiConfig`: [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md), `requestData`: `any`, `requestConfig?`: [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<`any`\>, `needTrim?`: `boolean`) => `Promise`<`any`\>

#### Returns

`fn`

▸ (`apiConfig`, `requestData`, `requestConfig?`, `needTrim?`): `Promise`<`any`\>

##### Parameters

| Name             | Type                                                                                                                     |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `apiConfig`      | [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md)                                                              |
| `requestData`    | `any`                                                                                                                    |
| `requestConfig?` | [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<`any`\> |
| `needTrim?`      | `boolean`                                                                                                                |

##### Returns

`Promise`<`any`\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:19](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L19)

---

### setHandler

▸ **setHandler**(`_handler`): `void`

#### Parameters

| Name       | Type                                                                                                                                                                                                                                                                                      |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_handler` | (`apiConfig`: [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md), `requestData`: `any`, `requestConfig?`: [`ObjectLiteral`](../interfaces/shared_tsdk_types.ObjectLiteral.md) \| [`RequestConfig`](axios.md#requestconfig)<`any`\>, `needTrim?`: `boolean`) => `Promise`<`any`\> |

#### Returns

`void`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/gen-api.ts:15](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/gen-api.ts#L15)
