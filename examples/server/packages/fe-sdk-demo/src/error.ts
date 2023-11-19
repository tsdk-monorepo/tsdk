/** TSDK Base Error */
export class TSDKError extends Error {
  //
}

/**
 * Before call, not set handler instance error
 */
export class NoHandlerError extends TSDKError {
  //
}

/**
 * Timeout error
 */
export class TimeoutError extends TSDKError {
  //
}

/**
 * No connection error
 */
export class NoConnectionError extends TSDKError {
  //
}
