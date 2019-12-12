const { log, logError } = require('./porter-logger');

const FAIL = 'FAIL';
const SUCCESS = 'SUCCESS';
let testCounter = 0;

const logTestResults = (testMsg, request, result) => {
  log(...[
    `TEST ${testCounter += 1}: ${testMsg}\n`,
    `Request: ${request}\n`,
    `... ${result()}\n`,
  ]);
};

const tests = [
  /** Test porter.get(object, path) */
  (porter, target) => {
    const testMessage = 'Porter.get: Should return the value by simple path.';
    const expected = target.games['Half-Life'];
    const requests = [
      'games.Half-Life',
      'games[Half-Life]',
      "games['Half-Life']",
    ];
    requests.forEach((path) => {
      const requestString = `porter.get(testSubject, '${path}')`;
      const callback = () => {
        let result = FAIL;

        try {
          const value = porter.get(target, path);

          if (value === expected) {
            result = SUCCESS;
          }
        } catch (ex) {
          logError(ex);
        }
        return result;
      };
      logTestResults(testMessage, requestString, callback);
    });
  },

  /** Test porter(object).get(path) */
  (porter, target) => {
    const testMessage = 'porterInstance.get. Should return the value by simple path.';
    const expected = target.games['Half-Life'];
    const requests = [
      'games.Half-Life',
      'games[Half-Life]',
      "games['Half-Life']",
    ];
    requests.forEach((path) => {
      const requestString = `porter(testSubject).get('${path}')`;
      const callback = () => {
        let result = FAIL;

        try {
          const value = porter(target).get(path);

          if (value === expected) {
            result = SUCCESS;
          }
        } catch (ex) {
          logError(ex);
        }
        return result;
      };
      logTestResults(testMessage, requestString, callback);
    });
  },
];

module.exports = { tests };
