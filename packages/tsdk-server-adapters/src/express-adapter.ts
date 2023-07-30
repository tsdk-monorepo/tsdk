// @ts-ignore
import type { Request, Response, NextFunction } from 'express';

import { genRouteFactory, getRouteEventName, ObjectLiteral } from './gen-route-factory';

export function expressAdapterFactory<ReqInfo>({
  routeBus,
  getReqInfo,
  getType,
  getData,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (req: Request) => ReqInfo | Promise<ReqInfo>;
  getData: (req: Request) => ObjectLiteral;
  getType: (reqInfo: ReqInfo, req: Request) => string;
}) {
  return async function expressAdapter(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toLowerCase();
    const reqInfo = await getReqInfo(req);
    const type = getType(reqInfo, req);
    const eventName = getRouteEventName({
      protocol: 'express',
      type,
      method,
      path: req.path,
    });

    if ((routeBus as ObjectLiteral)._events[eventName]) {
      const payload = getData(req);
      routeBus.emit(eventName, reqInfo, res, { payload });
    } else {
      next();
    }
  };
}
