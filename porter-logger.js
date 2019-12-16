function porterLogger(type, ...args) {
  const prefix = '\n>>> PORTER:\n';
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
    porterLogger('log', ...args);
  },
  logError(...args) {
    porterLogger('error', ...args);
  },
};
