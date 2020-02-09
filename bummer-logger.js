function bummerLogger(type, ...args) {
  const prefix = '\n>>> BUMMER:\n';
  const inform = console;

  switch (type) {
    case 'error':
      return inform.error(prefix, ...args);
    case 'log':
    default:
      return inform.log(prefix, ...args);
  }
}

module.exports = {
  log(...args) {
    bummerLogger('log', ...args);
  },
  logError(...args) {
    bummerLogger('error', ...args);
  },
};
