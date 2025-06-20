export enum LoggerKeys {
  token = "TOKEN",
  request = "REQUEST",
  response = "RESPONSE",
  error = "ERROR",
  info = "INFO",
}

export function DEV_LOGGER(key: LoggerKeys | string, ...args: any[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${key}]`, ...args);
  }
}
