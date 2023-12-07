import genRoute from '../todo/gen-route';
import {
  TestPathParamsConfig,
  TestPathParamsReq,
  TestPathParamsRes,
} from './apiconf/TestParams.apiconf';

export function setupTestRoute() {
  genRoute<TestPathParamsReq, TestPathParamsRes>(TestPathParamsConfig, async (reqInfo, data) => {
    return {
      a: data.a,
      c: data.c,
    };
  });
}
