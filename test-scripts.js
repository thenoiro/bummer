/** @typedef {('SUCCESS'|'FAIL')} TestResult */
/** @typedef {*} executorResults */

/**
 * @callback executorCallback
 * @returns {*} Any value which will be passed to the moderator callback later.
 */

/**
 * @callback moderatorCallback
 * @param {executorResults} value Any value returned by executor callback.
 * @returns {boolean} Is test completed successfully or not.
 */

const { log, logError } = require('./porter-logger');

let testCounter = 0;
const tests = [];
const FAIL = 'FAIL';
const SUCCESS = 'SUCCESS';
const has = (object, property) => Object.prototype.hasOwnProperty.call(object, property);

const summary = {
  [FAIL]: 0,
  [SUCCESS]: 0,
};
const requests = [
  'games.Half-Life',
  'games[Half-Life]',
  "games['Half-Life']",
];

/**
 * Log test meta and results
 * @param {string} testMsg Test message
 * @param {string} request String representation of tested feature
 * @param {string} result Test results (Success or Fail)
 */
const logResults = (testMsg, request, result) => {
  log(...[
    `TEST ${testCounter += 1}: ${testMsg}\n`,
    `Request: ${request}\n`,
    `... ${result}\n`,
  ]);
};

/**
 * Launches the test, and returns the result
 * @param {executorCallback} executor  Tested feature.
 * @param {moderatorCallback} moderator Results inspector.
 * @returns {TestResult}
 */
const testLauncher = (executor, moderator) => {
  let result = FAIL;

  try {
    const value = executor();

    if (moderator(value)) {
      result = SUCCESS;
    }
  } catch (ex) {
    logError(ex);
  }
  summary[result] += 1;
  return result;
};

/** Test porter.get(object, path) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.get: Should return the value by simple path.',
      `porter.get(testSubject, '${path}')`,
      testLauncher(
        () => porter.get(target, path),
        (v) => v === target.games['Half-Life'],
      ),
    );
  });
});

/** Test porter(object).get(path) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.get: Should return the value by simple path.',
      `porter.get(testSubject, '${path}')`,
      testLauncher(
        () => porter(target).get(path),
        (v) => v === target.games['Half-Life'],
      ),
    );
  });
});

/** Test porter.set(object, path, value) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter.set({}, '${path}', value)`,
      testLauncher(
        () => porter.set(target, path),
        (v) => v === true && target.games['Half-Life'] === settedValue,
      ),
    );
  });
});

/** Test porter(object).set(path, value) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter({}).set('${path}', value)`,
      testLauncher(
        () => porter(target).set(path),
        (v) => v === true && target.games['Half-Life'] === settedValue,
      ),
    );
  });
});

/** Test porter.set(object, path, value, false) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should try to set the value by non-existing path, and return the <false> value.',
      `porter.set({}, '${path}', value, false)`,
      testLauncher(
        () => porter.set(target, path, settedValue, false),
        (v) => v === false && !has(target, 'games'),
      ),
    );
  });
});

/** Test porter(object).set(path, value, false) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should try to set the value by non-existing path, and return the <false> value.',
      `porter({}).set('${path}', value, false)`,
      testLauncher(
        () => porter(target).set(path, settedValue, false),
        (v) => v === false && !has(target, 'games'),
      ),
    );
  });
});

/** Test porter.check(object, path) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.check: Should return <true> for existing property.',
      `porter.check(targetObject, '${path}')`,
      testLauncher(
        () => porter.check(target, path),
        (v) => v === true,
      ),
    );
  });
});
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    logResults(
      'Porter.check: Should return <false> for non-existing property.',
      `porter.check({}, '${path}')`,
      testLauncher(
        () => porter.check({}, path),
        (v) => v === false,
      ),
    );
  });
});

/** Test porter(object).check(path) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.check: Should return <true> for existing property.',
      `porter(targetObject).check('${path}')`,
      testLauncher(
        () => porter.check(target, path),
        (v) => v === true,
      ),
    );
  });
});

/** Test porter(object).check(path) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    logResults(
      'Porter.check: Should return <false> for non-existing property.',
      `porter({}).check('${path}')`,
      testLauncher(
        () => porter.check({}, path),
        (v) => v === false,
      ),
    );
  });
});

/** Test porter.remove(object, path, pop) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.remove: Should delete a property by the path and return the <true> value (success)',
      `porter.remove(targetObject, '${path}')`,
      testLauncher(
        () => porter.remove(target, path),
        (v) => v === true && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test porter(object).remove(path, pop) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.remove: Should delete a property by the path and return the <true> value (success)',
      `porter(targetObject).remove('${path}')`,
      testLauncher(
        () => porter(target).remove(path),
        (v) => v === true && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test porter.remove(object, path, pop) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const message = (
      'Porter.remove: Should try to delete a property by the non-existing path '
      + 'and return the <false> value (success)'
    );
    logResults(
      message,
      `porter.remove({}, '${path}')`,
      testLauncher(
        () => porter.remove({}, path),
        (v) => v === false,
      ),
    );
  });
});

/** Test porter(object).remove(path, pop) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const message = (
      'Porter.remove: Should try to delete a property by the non-existing path '
      + 'and return the <false> value (success)'
    );
    logResults(
      message,
      `porter(targetObject).remove('${path}')`,
      testLauncher(
        () => porter({}).remove(path),
        (v) => v === false,
      ),
    );
  });
});


/** Test porter.remove(object, path, pop) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    const targetValue = target.games['Half-Life'];

    logResults(
      'Porter.remove: Should delete a property by the path and return the value from there.',
      `porter.remove(targetObject, '${path}', true)`,
      testLauncher(
        () => porter.remove(target, path, true),
        (v) => v === targetValue && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test porter(object).remove(path, pop) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    const targetValue = target.games['Half-Life'];

    logResults(
      'Porter.remove: Should delete a property by the path and return the value from there.',
      `porter(targetObject).remove('${path}', true)`,
      testLauncher(
        () => porter(target).remove(path),
        (v) => v === targetValue && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test porter.remove(object, path, pop) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const message = (
      'Porter.remove: Should try to delete a property by the non-existing path and return the '
      + 'undefined value'
    );
    logResults(
      message,
      `porter.remove({}, '${path}, true')`,
      testLauncher(
        () => porter.remove({}, path, true),
        (v) => v === undefined,
      ),
    );
  });
});

/** Test porter.remove(object, path, pop) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const message = (
      'Porter.remove: Should try to delete a property by the non-existing path and return the '
      + 'undefined value'
    );
    logResults(
      message,
      `porter({}).remove('${path}, true')`,
      testLauncher(
        () => porter({}).remove(path, true),
        (v) => v === undefined,
      ),
    );
  });
});

/** Test porter.replace(object, path, value) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    const value = Symbol('Value');
    const previousValue = target.games['Half-Life'];

    logResults(
      'Porter.replace: Should replace the property value by the existing path with the new value',
      `porter.replace(targetObject, '${path}', value)`,
      testLauncher(
        () => porter.replace(target, path, value),
        (v) => (
          v === previousValue
          && target.games['Half-Life'] !== previousValue
          && target.games['Half-Life'] === value
        ),
      ),
    );
  });
});

/** Test porter(object).replace(path, value) */
requests.forEach((path) => {
  tests.push((porter, target) => {
    const value = Symbol('Value');
    const previousValue = target.games['Half-Life'];

    logResults(
      'Porter.replace: Should replace the property value by the existing path with the new value',
      `porter(targetObject).replace('${path}', value)`,
      testLauncher(
        () => porter(target).replace(path, value),
        (v) => (
          v === previousValue
          && target.games['Half-Life'] !== previousValue
          && target.games['Half-Life'] === value
        ),
      ),
    );
  });
});

/** Test porter.replace(object, path, value) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Porter.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. New value has to be setted up by the path '
      + 'successfully.'
    );
    logResults(
      message,
      `porter.replace({}, '${path}', value)`,
      testLauncher(
        () => porter.replace({}, path, value),
        (v) => v === undefined && target.games && target.games['Half-Life'] === value,
      ),
    );
  });
});

/** Test porter(object).replace(path, value) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Porter.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. New value has to be setted up by the path '
      + 'successfully.'
    );
    logResults(
      message,
      `porter({}).replace('${path}', value)`,
      testLauncher(
        () => porter(target).replace(path, value),
        (v) => v === undefined && target.games && target.games['Half-Life'] === value,
      ),
    );
  });
});

/** Test porter.replace(object, path, value) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Porter.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. Object structure should be unchanged.'
    );
    logResults(
      message,
      `porter.replace({}, '${path}', value, false)`,
      testLauncher(
        () => porter.replace(target, path, value, false),
        (v) => v === undefined && !has(target, 'games'),
      ),
    );
  });
});

/** Test porter(object).replace(path, value) */
requests.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Porter.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. Object structure should be unchanged.'
    );
    logResults(
      message,
      `porter({}).replace('${path}', value, false)`,
      testLauncher(
        () => porter(target).replace(path, value, false),
        (v) => v === undefined && !has(target, 'games'),
      ),
    );
  });
});


/** Summary */
tests.push((/* porter, target */) => {
  log(
    'SUMMARY:\n',
    `> Total: ${testCounter}\n`,
    `> Success: ${summary[SUCCESS]}\n`,
    `> Fails: ${summary[FAIL]}`,
  );
});


module.exports = { tests };
