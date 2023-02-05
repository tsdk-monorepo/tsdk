// @ts-ignore
import type { Socket } from 'socket.io';

import {
  genRouteFactory,
  getRouteEventName,
  ProtocolType,
  ObjectLiteral,
} from './gen-route-factory';

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
  getData?: (req: ObjectLiteral) => ObjectLiteral;
  protocolType: ProtocolType;
}) {
  return async function socketIOAdapter(socket: Socket) {
    const reqInfo = await getReqInfo(socket);

    const onRequest = (body: ObjectLiteral) => {
      if (!socket.connected) return;

      if (body && body._id) {
        const type = getType(reqInfo, socket);

        const [method, path] = body._id.split(':');
        const eventName = getRouteEventName({ protocol: 'socket.io', type, method, path });

        if ((routeBus as ObjectLiteral)._events[eventName]) {
          routeBus.emit(eventName, reqInfo, socket, getData ? getData(body) : body);
        }
      }
    };

    socket.on(protocolType.request, onRequest);

    return () => socket.off(protocolType.request, onRequest);
  };
}
