// @ts-ignore
import type { HonoRequest as Request, Context as HonoContext, Next as NextFunction } from 'hono';

import { genRouteFactory, getRouteEventName, ObjectLiteral } from './gen-route-factory';

export function honoAdapterFactory<ReqInfo>({
  routeBus,
  getReqInfo,
  getType,
  getData,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (req: Request) => ReqInfo | Promise<ReqInfo>;
  getData: (req: Request) => ObjectLiteral | Promise<ObjectLiteral>;
  getType: (reqInfo: ReqInfo, req: Request) => string;
}) {
  return async function honoAdapter(c: HonoContext, next: NextFunction): Promise<void | Response> {
    const { req } = c;
    const method = req.method.toLowerCase();
    const reqInfo = await getReqInfo(req);
    const type = getType(reqInfo, req);
    const paths = req.path.split(`/${type}/`);
    paths.shift();
    const path = `/${paths.join('/')}`;
    const eventName = getRouteEventName({
      protocol: 'hono',
      type,
      method,
      path,
    });
    if ((routeBus as ObjectLiteral)._events[eventName]) {
      const payload = await getData(req);
      const response = await new Promise((resolve, reject) => {
        routeBus.emit(eventName, reqInfo, c, { payload }, (result: Response) => {
          try {
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      });
      return response as Response;
    } else {
      return next();
    }
  };
}
