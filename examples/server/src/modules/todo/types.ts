export interface RequestInfo {
  ip: string;
  lang: string;
  type: string;
  /** username */
  username?: string;
  /** userId */
  userId?: number;
  token?: string;
}
