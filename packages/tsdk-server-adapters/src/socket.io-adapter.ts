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
  protocolType,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (socket: Socket) => ReqInfo;
  protocolType: ProtocolType;
}) {
  return function socketIOAdapter(socket: Socket) {
    const reqInfo = getReqInfo(socket);

    socket.on(protocolType.request, (body) => {
      if (!socket.connected) return;

      if (body._id) {
        const [method, path] = body._id.split(':');
        const eventName = getRouteEventName({ protocol: 'socket.io', method, path });

        if ((routeBus as ObjectLiteral)._events[eventName]) {
          routeBus.emit(eventName, reqInfo, socket, body);
        }
      }
    });

    socket.on(protocolType.set, (data) => {
      if (data.key === 'lang') {
        (reqInfo as ObjectLiteral).lang = data.value;
      }
    });
  };
}
