import type { Socket } from 'socket.io';

import {
  genRouteFactory,
  getRouteEventName,
  ProtocolType,
  ObjectLiteral,
} from './gen-route-factory';

/**
 * The `methods` sort order should same with
 * `packages/tsdk/fe-sdk-template/src/utils.ts`
 */
const methods = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
const methodsMap: { [key: string]: string } = {};
methods.forEach((i, idx) => {
  methodsMap[idx] = i;
});

export function socketIOAdapterFactory<ReqInfo>({
  routeBus,
  getReqInfo,
  getData,
  protocolType,
  getType,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (socket: Socket) => ReqInfo | Promise<ReqInfo>;
  getType: (reqInfo: ReqInfo, socket: Socket) => string;
  getData?: (req: ObjectLiteral) => ObjectLiteral | Promise<ObjectLiteral>;
  protocolType: ProtocolType;
}) {
  return async function socketIOAdapter(socket: Socket) {
    const reqInfo = await getReqInfo(socket);

    const onRequest = async (data: { _id: string; payload: unknown }) => {
      if (!socket.connected) return;

      if (data && data._id) {
        const type = getType(reqInfo, socket);

        const [methodIdx, path] = data._id.split(':');
        const method = methodsMap[methodIdx] || methodIdx || 'get';
        const eventName = getRouteEventName({ protocol: 'socket.io', type, method, path });

        if ((routeBus as ObjectLiteral)._events[eventName]) {
          routeBus.emit(eventName, reqInfo, socket, getData ? await getData(data) : data);
        }
      }
    };

    socket.on(protocolType.request, onRequest);

    return () => socket.off(protocolType.request, onRequest);
  };
}
