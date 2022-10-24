import type { Socket } from 'socket.io';
import { ObjectLiteral, Type, getRouteEventName, genRouteFactory } from './gen-route-factory';

export function socketIOAdapterFactory<ReqInfo>({
  routeBus,
  getReqInfo,
  type,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (socket: Socket) => ReqInfo;
  type: Type;
}) {
  return function socketIOAdapter(socket: Socket) {
    const reqInfo = getReqInfo(socket);

    socket.on(type.request, (body) => {
      if (!socket.connected) return;

      if (body._id) {
        const [method, path] = body._id.split(':');
        const eventName = getRouteEventName({ protocol: 'socket.io', method, path });

        if ((routeBus as ObjectLiteral)._events[eventName]) {
          routeBus.emit(eventName, reqInfo, socket, body);
        }
      }
    });

    socket.on(type.set, (data) => {
      if (data.key === 'lang') {
        (reqInfo as ObjectLiteral).lang = data.value;
      }
    });
  };
}
