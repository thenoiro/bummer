type Key = symbol;

enum LogType {
  Log,
  Error,
}

const develop = true;
const inform = console;
const forceKey = Symbol('Force Key');

const log = (type: LogType, key: Key | any, ...args: any[]): void => {
  let values = args;

  if (key !== forceKey) {
    values = [key, ...args];
  }
  if (!develop || key === forceKey) {
    switch (type) {
      case LogType.Error: {
        inform.error(...values);
        break;
      }
      case LogType.Log:
      default: {
        inform.log(...values);
        break;
      }
    }
  }
};
const logger = {
  log(key: Key | any, ...args: any[]): void {
    log(LogType.Log, key, ...args);
  },
  error(key: Key | any, ...args: any[]): void {
    log(LogType.Error, key, ...args);
  },
};


export { logger as inform };
export { forceKey };
