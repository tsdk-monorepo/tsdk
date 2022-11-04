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
  getReqInfo: (req: Request) => ReqInfo;
  getData: (req: Request) => ObjectLiteral;
  getType: (reqInfo: ReqInfo, req: Request) => string;
}) {
  return function expressAdapter(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toLowerCase();
    const reqInfo = getReqInfo(req);
    const type = getType(reqInfo, req);
    const eventName = getRouteEventName({
      protocol: 'http',
      type,
      method,
      path: req.path,
    });

    if ((routeBus as ObjectLiteral)._events[eventName]) {
      const body = getData(req);
      routeBus.emit(eventName, reqInfo, res, body);
    } else {
      next();
    }
  };
}
