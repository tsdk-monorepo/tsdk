// @ts-ignore
import { WebSocket } from 'ws';
import {
  genRouteFactory,
  getRouteEventName,
  ProtocolType,
  ObjectLiteral,
} from './gen-route-factory';

/**
 * @deprecated Not ready for production, Please use Socket.IO
 */
export function wsAdapterFactory<ReqInfo>({
  routeBus,
  getReqInfo,
  protocolType,
}: {
  routeBus: ReturnType<typeof genRouteFactory>['routeBus'];
  getReqInfo: (socket: WebSocket) => ReqInfo;
  protocolType: ProtocolType;
}) {
  return function wsAdapter(socket: WebSocket) {
    const reqInfo = getReqInfo(socket);

    socket.on('message', (payload, isBinary) => {
      const data = payload.toString();
      const type = data.toString().substring(0, protocolType.request.length);
      if (type === protocolType.request) {
        try {
          const body = JSON.parse(data.toString().substring(protocolType.request.length));
          if (socket.readyState === 1) {
            if (body.path) {
              routeBus.emit(
                getRouteEventName({
                  protocol: 'ws',
                  type: '',
                  method: body.method,
                  path: body.path,
                }),
                reqInfo,
                socket,
                body
              );
            }
          }
        } catch (e) {
          // not valid payload
        }
      }
    });
  };
}
