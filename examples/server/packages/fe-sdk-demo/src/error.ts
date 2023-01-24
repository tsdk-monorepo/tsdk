/** TSDK Base Error */
export class TSDKBaseError extends Error {
  //
}

/**
 * Before call, not set handler instance error
 */
export class NoHandlerError extends TSDKBaseError {
  //
}

/**
 * Timeout error
 */
export class TimeoutError extends TSDKBaseError {
  //
}

/**
 * No connection error
 */
export class NoConnectionError extends TSDKBaseError {
  //
}
