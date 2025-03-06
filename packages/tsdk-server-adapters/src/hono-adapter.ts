// @ts-ignore
import type { HonoRequest as Request, Context as HonoContext, Next as NextFunction } from 'hono';
import { genRouteFactory, getRouteEventName, ObjectLiteral } from './gen-route-factory';

/**
 * Factory to create a Hono middleware adapter for the route bus
 * @param options Configuration options for the adapter
 * @returns Hono middleware function
 */
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
  return async function honoAdapter(c: HonoContext, next: NextFunction): Promise<Response | void> {
    try {
      const { req } = c;
      const method = req.method.toLowerCase();

      // Extract request info and determine the route type
      const reqInfo = await getReqInfo(req);
      const type = getType(reqInfo, req);

      // Parse the path based on the route type
      const paths = req.path.split(`/${type}/`);
      paths.shift();
      const path = paths.length > 0 ? `/${paths.join('/')}` : '/';

      // Generate the event name for the route
      const eventName = getRouteEventName({
        protocol: 'hono',
        type,
        method,
        path,
      });

      // Check if there's a handler for this route
      const hasHandler =
        (routeBus as ObjectLiteral)._events && eventName in (routeBus as ObjectLiteral)._events;

      if (hasHandler) {
        const payload = await getData(req);

        // Process the request through the route bus
        return await new Promise<Response>((resolve, reject) => {
          routeBus.emit(eventName, reqInfo, c, { payload }, (result: Response | Error) => {
            if (result instanceof Error) {
              reject(result);
            } else {
              resolve(result);
            }
          });
        });
      }

      // No handler found, continue to next middleware
      return next();
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error in Hono adapter:', error);

      // Return a generic error response
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}
