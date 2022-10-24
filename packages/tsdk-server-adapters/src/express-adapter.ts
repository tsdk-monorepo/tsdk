/** @ts-ignore */
import type { Request, Response, NextFunction } from 'express';
import { genRouteFactory, getRouteEventName, ObjectLiteral } from './gen-route-factory';

export function expressAdapterFactory<ReqInfo>({
  routeBus,
  getReqInfo,
  getData,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (req: Request) => ReqInfo;
  getData: (req: Request) => ObjectLiteral;
}) {
  return function expressAdapter(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toLowerCase();
    const eventName = getRouteEventName({
      protocol: 'http',
      method,
      path: req.path,
    });

    if ((routeBus as ObjectLiteral)._events[eventName]) {
      const reqInfo = getReqInfo(req);
      const body = getData(req);
      routeBus.emit(eventName, reqInfo, res, body);
    } else {
      next();
    }
  };
}
