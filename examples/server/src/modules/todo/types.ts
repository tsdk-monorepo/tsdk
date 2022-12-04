export interface GeneralParams {
  ip: string;
  lang: string;
}

export interface RequestInfo extends GeneralParams {
  /** user or admin? */
  type: string;
  username?: string;
  userId?: number;
  token?: string;
}
