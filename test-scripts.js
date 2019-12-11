const { log, logError } = require('./porter-logger');

const FAIL = 'FAIL';
const SUCCESS = 'SUCCESS';
let testCounter = 1;

const logTestResults = (testMsg, request, expected, result) => {
  const delimiter = '-------------------------------------\n';
  log(...[
    delimiter,
    `TEST ${testCounter += 1}: ${testMsg}\n`,
    `Request: ${request}\n`,
    // `Expected: ${expected}\n`,
    '...\n',
    `Result: ${result()}\n`,
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
      logTestResults(testMessage, requestString, expected, callback);
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
      logTestResults(testMessage, requestString, expected, callback);
    });
  },
];

module.exports = { tests };
