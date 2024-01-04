import genRoute from '../todo/gen-route';
import {
  TestPathParamsConfig,
  TestPathParamsReq,
  TestPathParamsRes,
} from './apiconf/TestParams.apiconf';

export function setupTestRoute() {
  genRoute<TestPathParamsReq, TestPathParamsRes>(TestPathParamsConfig, async (data, reqInfo) => {
    return {
      a: data.a,
      c: data.c,
    };
  });
}
