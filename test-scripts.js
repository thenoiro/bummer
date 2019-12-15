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
const hhgg = () => "The Hitchhiker's Guide to te Galaxy";

const summary = {
  [FAIL]: 0,
  [SUCCESS]: 0,
  errors: 0,
};
const requestsSimple = [
  'games.Half-Life',
  'games[Half-Life]',
  "games['Half-Life']",
  'games["Half-Life"]',
];
const requestsArrayProperties = [
  `books.${hhgg()}.0.name`,
  `books.${hhgg()}[0].name`,
  `books.${hhgg()}['0'].name`,
  `books.${hhgg()}["0"].name`,
  // `books.${hhgg()}.[0].name`,
  // `books.${hhgg()}.'0'.name`,
];
const requestsArrayNonStandardProperties = [
  `books.${hhgg()}.info.name`,
  `books.${hhgg()}.13`,
  `books.${hhgg()}.42.`,
];
const requestsNullableProperties = [
  `books.${hhgg()}.2.read`,
  `books.${hhgg()}.3.read`,
  `books.${hhgg()}.5.year`,
  'games.Half-Life.4',
];
const requestsByMixedType = [
  ['games', 'Half-Life', '0', 'year'],
  ['games.Half-Life', '0.year'],
  ['games.Half-Life', '[0].year'],
  ['games.Half-Life', "['0'].year"],
  ['games.Half-Life', 0, 'year'],
];
const requestsInfinityValue = [
  ['books', hhgg(), Infinity, 'name'],
];

const joinSplittedPath = (pathArray) => {
  const slices = pathArray.map((p) => {
    const stringSlice = String(p);

    if (stringSlice.indexOf("'") === -1) {
      return `'${stringSlice}'`;
    }
    return `"${stringSlice}"`;
  });
  return slices.join(', ');
};

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
    summary.errors += 1;
  }
  summary[result] += 1;
  return result;
};


/** GET */

/** porter.get(object, path) */
requestsSimple.forEach((path) => {
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
requestsArrayProperties.forEach((path) => {
  tests.push((porter, target) => {
    const message = (
      'Porter.get: Should return an array property by index in different representations '
      + '(string, number, etc).'
    );
    logResults(
      message,
      `porter.get(testSubject, '${path}')`,
      testLauncher(
        () => porter.get(target, path),
        (v) => v === target.books[hhgg()][0].name,
      ),
    );
  });
});
requestsArrayNonStandardProperties.forEach((path, i) => {
  tests.push((porter, target) => {
    const middleNode = target.books[hhgg()];

    logResults(
      'Porter.get: Should return an array non-index property successfully.',
      `porter.get(testSubject, ${path})`,
      testLauncher(
        () => porter.get(target, path),
        (v) => {
          switch (i) {
            case 0: return v === middleNode.info.name;
            case 1: return v === undefined;
            case 2: return v === middleNode[42];
            default: return false;
          }
        },
      ),
    );
  });
});
requestsNullableProperties.forEach((path, i) => {
  tests.push((porter, target) => {
    logResults(
      'Porter.get: Should return nullable values (undefined, NaN, null) successfully.',
      `porter.get(testSubject, ${path})`,
      testLauncher(
        () => porter.get(target, path),
        (v) => {
          switch (i) {
            case 0: return v === false;
            case 1: return v === null;
            case 2: return Number.isNaN(v);
            case 3: return v === undefined;
            default: return false;
          }
        },
      ),
    );
  });
});
requestsByMixedType.forEach((path) => {
  tests.push((porter, target) => {
    const message = (
      'Porter.get: Should return values successfully by the array of path pieces (which presented'
      + 'as strings or numbers)'
    );
    logResults(
      message,
      `porter.get(testSubject, [${joinSplittedPath(path)}])`,
      testLauncher(
        () => porter.get(target, path),
        (v) => v === target.games['Half-Life'][0].year,
      ),
    );
  });
});
requestsInfinityValue.forEach((path) => {
  tests.push((porter, target) => {
    const message = (
      'Porter.get: Should return value by an array of path pieces, which contains Infinit value as'
      + ' an object key'
    );
    logResults(
      message,
      `porter.get(testSubject, [${joinSplittedPath(path)}])`,
      testLauncher(
        () => porter.get(target, path),
        (v) => v === target.books[hhgg()][Infinity].name,
      ),
    );
  });
});

/** porter(object).get(path) */
requestsSimple.forEach((path) => {
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


/** SET */

/** Test porter.set(object, path, value) */
requestsSimple.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter.set({}, '${path}', value)`,
      testLauncher(
        () => porter.set(target, path, settedValue),
        (v) => v === true && target.games['Half-Life'] === settedValue,
      ),
    );
  });
});
requestsArrayProperties.forEach((path) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter.set({}, '${path}', value)`,
      testLauncher(
        () => porter.set(target, path, settedValue),
        (v) => v === true && target.books[hhgg()][0].name === settedValue,
      ),
    );
  });
});
requestsArrayNonStandardProperties.forEach((path, i) => {
  tests.push((porter/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter.set({}, '${path}', value)`,
      testLauncher(
        () => porter.set(target, path, settedValue),
        (v) => {
          const success = v === true;
          const middleNode = target.books[hhgg()];

          switch (i) {
            case 0: return success && middleNode.info.name === settedValue;
            case 1: return success && middleNode[13] === settedValue;
            case 2: return success && middleNode[42] === settedValue;
            default: return false;
          }
        },
      ),
    );
  });
});
requestsByMixedType.forEach((path) => {
  tests.push((porter/* , target */) => {
    const settedValue = Symbol('Value');
    const target = {};

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter.set({}, '${joinSplittedPath(path)}', value)`,
      testLauncher(
        () => porter.set(target, path, settedValue),
        (v) => v === true && v === target.games['Half-Life'][0].year,
      ),
    );
  });
});
requestsInfinityValue.forEach((path) => {
  tests.push((porter/* , target */) => {
    const settedValue = Symbol('Value');
    const target = {};

    logResults(
      'Porter.set: Should set the value by non-existing path, and return the <true> value.',
      `porter.set({}, '${joinSplittedPath})', value`,
      testLauncher(
        () => porter.set(target, path, settedValue),
        (v) => v === true && target.books[hhgg()][Infinity].name === settedValue,
      ),
    );
  });
});


/** Test porter(object).set(path, value) */
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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


/** CHECK */

/** Test porter.check(object, path) */
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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


/** REMOVE */

/** Test porter.remove(object, path, pop) */
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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


/** REPLACE */

/** Test porter.replace(object, path, value) */
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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
requestsSimple.forEach((path) => {
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


/** SPECIAL */

/** Summary */
tests.push((/* porter, target */) => {
  log(
    'SUMMARY:\n',
    `> Total: ${testCounter}\n`,
    `> Success: ${summary[SUCCESS]}\n`,
    `> Fails: ${summary[FAIL]}\n`,
    `>> Errors: ${summary.errors}`,
  );
});


module.exports = { tests };
