---
id: 'axios'
title: 'Module: axios'
sidebar_label: 'axios'
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

### RequestConfig

Ƭ **RequestConfig**<`ReqPayload`\>: `Omit`<`AxiosRequestConfig`, `"data"`\> & { `data?`: `ReqPayload` }

#### Type parameters

| Name         |
| :----------- |
| `ReqPayload` |

#### Defined in

[examples/server/packages/fe-sdk-demo/src/axios.ts:25](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/axios.ts#L25)

## Functions

### axiosHandler

▸ **axiosHandler**(`apiConfig`, `requestData`, `requestConfig?`, `needTrim?`): `Promise`<`any`\>

#### Parameters

| Name             | Type                                                        |
| :--------------- | :---------------------------------------------------------- |
| `apiConfig`      | [`APIConfig`](../interfaces/shared_tsdk_types.APIConfig.md) |
| `requestData`    | `any`                                                       |
| `requestConfig?` | [`RequestConfig`](axios.md#requestconfig)<`any`\>           |
| `needTrim?`      | `boolean`                                                   |

#### Returns

`Promise`<`any`\>

#### Defined in

[examples/server/packages/fe-sdk-demo/src/axios.ts:29](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/axios.ts#L29)

---

### getAxiosInstance

▸ **getAxiosInstance**(): `AxiosInstance`

Get the AxiosInstance

#### Returns

`AxiosInstance`

The AxiosInstance

#### Defined in

[examples/server/packages/fe-sdk-demo/src/axios.ts:21](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/axios.ts#L21)

---

### setAxiosInstance

▸ **setAxiosInstance**(`instance`): `void`

Set the AxiosInstance

#### Parameters

| Name       | Type            | Description   |
| :--------- | :-------------- | :------------ |
| `instance` | `AxiosInstance` | AxiosInstance |

#### Returns

`void`

#### Defined in

[examples/server/packages/fe-sdk-demo/src/axios.ts:11](https://github.com/jiouiuw/tsdk-monorepo/blob/4c9ec73/examples/server/packages/fe-sdk-demo/src/axios.ts#L11)
