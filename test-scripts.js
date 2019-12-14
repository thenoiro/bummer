const { log, logError } = require('./porter-logger');

const FAIL = 'FAIL';
const SUCCESS = 'SUCCESS';
let testCounter = 0;

const summary = {
  [FAIL]: 0,
  [SUCCESS]: 0,
};

const logResults = (testMsg, request, result) => {
  log(...[
    `TEST ${testCounter += 1}: ${testMsg}\n`,
    `Request: ${request}\n`,
    `... ${result()}\n`,
  ]);
};
const testLauncher = (executor, expected) => {
  let result = FAIL;

  try {
    const value = executor();

    if (value === expected) {
      result = SUCCESS;
    }
  } catch (ex) {
    logError(ex);
  }
  summary[result] += 1;
  return result;
};

const tests = [];
const requests = [
  'games.Half-Life',
  'games[Half-Life]',
  "games['Half-Life']",
];

/** Test porter.get(object, path) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    const executor = () => porter.get(target, path);
    const callback = () => testLauncher(executor, target.games['Half-Life']);
    logResults(
      'Porter.get: Should return the value by simple path.',
      `porter.get(testSubject, '${path}')`,
      callback,
    );
  });
});

/** Test porter(object).get(path) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    const executor = () => porter(target).get(path);
    const callback = () => testLauncher(executor, target.games['Half-Life']);
    logResults(
      'Porter.get: Should return the value by simple path.',
      `porter.get(testSubject, '${path}')`,
      callback,
    );
  });
});

/** Summary */
tests.push((/* porter, target */) => {
  log(
    'SUMMARY:\n',
    `> Success: ${summary[SUCCESS]}\n`,
    `> Fails: ${summary[FAIL]}`,
  );
});


module.exports = { tests };
