import { Socket } from 'socket.io-client';
import { APIConfig, ObjectLiteral } from './shared/tsdk-helper';
/**
 * Set the io
 *
 * @param instance - io
 */
export declare const setSocketIOInstance: (instance: Socket) => void;
/**
 * Get the io
 *
 * @param instance - io
 * @returns The io
 */
export declare const getSocketIOInstance: () => Socket<
  import('@socket.io/component-emitter').DefaultEventsMap,
  import('@socket.io/component-emitter').DefaultEventsMap
>;
export declare function socketIOHandler(
  apiConfig: APIConfig,
  data: any,
  requestConfig?: ObjectLiteral & {
    timeout?: number;
  },
  needTrim?: boolean
): Promise<any>;
