export * from './tsdk-types';
export declare const withDataMethods: {
  [key: string]: boolean | undefined;
};
export declare function checkMethodHasBody(method: string): boolean | undefined;
export declare function transformPath(path: string): string;
export declare const TYPE: {
  request: string;
  response: string;
  set: string;
};
export declare const PROTOCOLs: {
  http: string;
  ws: string;
  'socket.io': string;
};
export declare const PROTOCOL_VALUEs: string[];
