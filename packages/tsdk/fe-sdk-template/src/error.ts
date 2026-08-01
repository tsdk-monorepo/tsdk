/** TSDK Base Error */
export class TSDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TSDKError';
  }
}

/**
 * Before call, not set handler instance error
 */
export class NoHandlerError extends TSDKError {
  constructor(message: string) {
    super(message);
    this.name = 'NoHandlerError';
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends TSDKError {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * No connection error
 */
export class NoConnectionError extends TSDKError {
  constructor(message: string) {
    super(message);
    this.name = 'NoConnectionError';
  }
}
