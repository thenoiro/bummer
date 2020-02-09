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

const { log, logError } = require('./bummer-logger');

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
];
const requestsArrayProperties = [
  `books.${hhgg()}.0.name`,
  `books.${hhgg()}[0].name`,
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

/** bummer.get(object, path) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.get: Should return the value by simple path.',
      `bummer.get(testSubject, '${path}')`,
      testLauncher(
        () => bummer.get(target, path),
        (v) => v.val() === target.games['Half-Life'],
      ),
    );
  });
});
requestsArrayProperties.forEach((path) => {
  tests.push((bummer, target) => {
    const message = (
      'Bummer.get: Should return an array property by index in different representations '
      + '(string, number, etc).'
    );
    logResults(
      message,
      `bummer.get(testSubject, '${path}')`,
      testLauncher(
        () => bummer.get(target, path),
        (v) => v.val() === target.books[hhgg()][0].name,
      ),
    );
  });
});
requestsArrayNonStandardProperties.forEach((path, i) => {
  tests.push((bummer, target) => {
    const middleNode = target.books[hhgg()];

    logResults(
      'Bummer.get: Should return an array non-index property successfully.',
      `bummer.get(testSubject, ${path})`,
      testLauncher(
        () => bummer.get(target, path),
        (v) => {
          switch (i) {
            case 0: return v.val() === middleNode.info.name;
            case 1: return v.val() === undefined;
            case 2: return v.val() === middleNode[42];
            default: return false;
          }
        },
      ),
    );
  });
});
requestsNullableProperties.forEach((path, i) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.get: Should return nullable values (undefined, NaN, null) successfully.',
      `bummer.get(testSubject, ${path})`,
      testLauncher(
        () => bummer.get(target, path),
        (v) => {
          switch (i) {
            case 0: return v.val() === false;
            case 1: return v.val() === null;
            case 2: return Number.isNaN(v.val());
            case 3: return v.val() === undefined;
            default: return false;
          }
        },
      ),
    );
  });
});
requestsByMixedType.forEach((path) => {
  tests.push((bummer, target) => {
    const message = (
      'Bummer.get: Should return values successfully by the array of path pieces (which presented'
      + 'as strings or numbers)'
    );
    logResults(
      message,
      `bummer.get(testSubject, [${joinSplittedPath(path)}])`,
      testLauncher(
        () => bummer.get(target, path),
        (v) => v.val() === target.games['Half-Life'][0].year,
      ),
    );
  });
});
requestsInfinityValue.forEach((path) => {
  tests.push((bummer, target) => {
    const message = (
      'Bummer.get: Should return value by an array of path pieces, which contains Infinit value as'
      + ' an object key'
    );
    logResults(
      message,
      `bummer.get(testSubject, [${joinSplittedPath(path)}])`,
      testLauncher(
        () => bummer.get(target, path),
        (v) => v.val() === target.books[hhgg()][Infinity].name,
      ),
    );
  });
});

/** bummer(object).get(path) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.get: Should return the value by simple path.',
      `bummer.get(testSubject, '${path}')`,
      testLauncher(
        () => bummer(target).get(path),
        (v) => v.val() === target.games['Half-Life'],
      ),
    );
  });
});


/** SET */

/** Test bummer.set(object, path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Bummer.set: Should set the value by non-existing path, and return the <true> value.',
      `bummer.set({}, '${path}', value)`,
      testLauncher(
        () => bummer.set(target, path, settedValue),
        (v) => v.val() === true && target.games['Half-Life'] === settedValue,
      ),
    );
  });
});
requestsArrayProperties.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Bummer.set: Should set the value by non-existing path, and return the <true> value.',
      `bummer.set({}, '${path}', value)`,
      testLauncher(
        () => bummer.set(target, path, settedValue),
        (v) => v.val() === true && target.books[hhgg()][0].name === settedValue,
      ),
    );
  });
});
requestsArrayNonStandardProperties.forEach((path, i) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Bummer.set: Should set the value by non-existing path, and return the <true> value.',
      `bummer.set({}, '${path}', value)`,
      testLauncher(
        () => bummer.set(target, path, settedValue),
        (v) => {
          const success = v.val() === true;
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
  tests.push((bummer/* , target */) => {
    const settedValue = Symbol('Value');
    const target = {};

    logResults(
      'Bummer.set: Should set the value by non-existing path, and return the <true> value.',
      `bummer.set({}, '${joinSplittedPath(path)}', value)`,
      testLauncher(
        () => bummer.set(target, path, settedValue),
        (v) => v.val() === true && settedValue === target.games['Half-Life'][0].year,
      ),
    );
  });
});
requestsInfinityValue.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const settedValue = Symbol('Value');
    const target = {};

    logResults(
      'Bummer.set: Should set the value by non-existing path, and return the <true> value.',
      `bummer.set({}, '${joinSplittedPath})', value`,
      testLauncher(
        () => bummer.set(target, path, settedValue),
        (v) => v.val() === true && target.books[hhgg()][Infinity].name === settedValue,
      ),
    );
  });
});


/** Test bummer(object).set(path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Bummer.set: Should set the value by non-existing path, and return the <true> value.',
      `bummer({}).set('${path}', value)`,
      testLauncher(
        () => bummer(target).set(path, settedValue),
        (v) => v.val() === true && target.games['Half-Life'] === settedValue,
      ),
    );
  });
});

/** Test bummer.set(object, path, value, false) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Bummer.set: Should try to set the value by non-existing path, and return the <false> value.',
      `bummer.set({}, '${path}', value, false)`,
      testLauncher(
        () => bummer.set(target, path, settedValue, false),
        (v) => v.val() === false && !has(target, 'games'),
      ),
    );
  });
});

/** Test bummer(object).set(path, value, false) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const settedValue = Symbol('Value');

    logResults(
      'Bummer.set: Should try to set the value by non-existing path, and return the <false> value.',
      `bummer({}).set('${path}', value, false)`,
      testLauncher(
        () => bummer(target).set(path, settedValue, false),
        (v) => v.val() === false && !has(target, 'games'),
      ),
    );
  });
});


/** CHECK */

/** Test bummer.check(object, path) */
[
  ...requestsSimple,
  ...requestsArrayProperties,
  ...requestsArrayNonStandardProperties,
  ...requestsNullableProperties,
  ...requestsByMixedType,
  ...requestsInfinityValue,
].forEach((path) => {
  tests.push((bummer, target) => {
    const pathStringRepresentation = Array.isArray(path)
      ? `[${joinSplittedPath(path)}]`
      : `'${path}'`;

    // Property which ended with '.13' doesn't exist
    const existed = pathStringRepresentation.indexOf('.13') === -1;

    logResults(
      'Bummer.check: Should return <true> for existing property.',
      `bummer.check(targetObject, ${pathStringRepresentation})`,
      testLauncher(
        () => bummer.check(target, path),
        (v) => v.val() === existed,
      ),
    );
  });
});

/** Test bummer.check(object, path) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    logResults(
      'Bummer.check: Should return <false> for non-existing property.',
      `bummer.check({}, '${path}')`,
      testLauncher(
        () => bummer.check({}, path),
        (v) => v.val() === false,
      ),
    );
  });
});

/** Test bummer(object).check(path) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.check: Should return <true> for existing property.',
      `bummer(targetObject).check('${path}')`,
      testLauncher(
        () => bummer.check(target, path),
        (v) => v.val() === true,
      ),
    );
  });
});

/** Test bummer(object).check(path) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    logResults(
      'Bummer.check: Should return <false> for non-existing property.',
      `bummer({}).check('${path}')`,
      testLauncher(
        () => bummer.check({}, path),
        (v) => v.val() === false,
      ),
    );
  });
});


/** REMOVE */

/** Test bummer.remove(object, path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer.remove(targetObject, '${path}')`,
      testLauncher(
        () => bummer.remove(target, path),
        (v) => v.val() === true && !has(target.games, 'Half-Life'),
      ),
    );
  });
});
requestsArrayProperties.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer.remove(targetObject, '${path}')`,
      testLauncher(
        () => bummer.remove(target, path),
        (v) => v.val() === true && !has(target.books[hhgg()][0], 'name'),
      ),
    );
  });
});
requestsArrayNonStandardProperties.forEach((path, i) => {
  tests.push((bummer, target) => {
    const middleNode = target.books[hhgg()];

    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer.remove(targetObject, '${path}')`,
      testLauncher(
        () => bummer.remove(target, path),
        (v) => {
          const result = v.val() === true;

          switch (i) {
            case 0: return result && !has(middleNode.info, 'name');
            case 1: return !result;
            case 2: return result && !has(middleNode, '42');
            default: return false;
          }
        },
      ),
    );
  });
});
requestsNullableProperties.forEach((path, i) => {
  tests.push((bummer, target) => {
    const middleNode = target.books[hhgg()];

    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer.remove(targetObject, '${path}')`,
      testLauncher(
        () => bummer.remove(target, path),
        (v) => {
          const result = v.val() === true;

          switch (i) {
            case 0: return result && !has(middleNode[2], 'read');
            case 1: return result && !has(middleNode[3], 'read');
            case 2: return result && !has(middleNode[5], 'year');
            case 3: return result && !has(target.games['Half-Life'], '4');
            default: return false;
          }
        },
      ),
    );
  });
});
requestsByMixedType.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer.remove(targetObject, [${joinSplittedPath(path)}])`,
      testLauncher(
        () => bummer.remove(target, path),
        (v) => v.val() === true && !has(target.games['Half-Life'][0], 'year'),
      ),
    );
  });
});
requestsInfinityValue.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer.remove(targetObject, [${joinSplittedPath(path)}])`,
      testLauncher(
        () => bummer.remove(target, path),
        (v) => v.val() === true && !has(target.books[hhgg()][Infinity], 'name'),
      ),
    );
  });
});

/** Test bummer(object).remove(path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    logResults(
      'Bummer.remove: Should delete a property by the path and return the <true> value (success)',
      `bummer(targetObject).remove('${path}')`,
      testLauncher(
        () => bummer(target).remove(path),
        (v) => v.val() === true && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test bummer.remove(object, path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const message = (
      'Bummer.remove: Should try to delete a property by the non-existing path '
      + 'and return the <false> value (success)'
    );
    logResults(
      message,
      `bummer.remove({}, '${path}')`,
      testLauncher(
        () => bummer.remove({}, path),
        (v) => v.val() === false,
      ),
    );
  });
});

/** Test bummer(object).remove(path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const message = (
      'Bummer.remove: Should try to delete a property by the non-existing path '
      + 'and return the <false> value (success)'
    );
    logResults(
      message,
      `bummer(targetObject).remove('${path}')`,
      testLauncher(
        () => bummer({}).remove(path),
        (v) => v.val() === false,
      ),
    );
  });
});


/** Test bummer.remove(object, path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    const targetValue = target.games['Half-Life'];

    logResults(
      'Bummer.remove: Should delete a property by the path and return the value from there.',
      `bummer.remove(targetObject, '${path}', true)`,
      testLauncher(
        () => bummer.remove(target, path, true),
        (v) => v.val() === targetValue && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test bummer(object).remove(path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    const targetValue = target.games['Half-Life'];

    logResults(
      'Bummer.remove: Should delete a property by the path and return the value from there.',
      `bummer(targetObject).remove('${path}', true)`,
      testLauncher(
        () => bummer(target).remove(path, true),
        (v) => v.val() === targetValue && !has(target.games, 'Half-Life'),
      ),
    );
  });
});

/** Test bummer.remove(object, path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const message = (
      'Bummer.remove: Should try to delete a property by the non-existing path and return the '
      + 'undefined value'
    );
    logResults(
      message,
      `bummer.remove({}, '${path}, true')`,
      testLauncher(
        () => bummer.remove({}, path, true),
        (v) => v.val() === undefined,
      ),
    );
  });
});

/** Test bummer.remove(object, path, pop) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const message = (
      'Bummer.remove: Should try to delete a property by the non-existing path and return the '
      + 'undefined value'
    );
    logResults(
      message,
      `bummer({}).remove('${path}, true')`,
      testLauncher(
        () => bummer({}).remove(path, true),
        (v) => v.val() === undefined,
      ),
    );
  });
});


/** REPLACE */

/** Test bummer.replace(object, path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const previousValue = target.games['Half-Life'];

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer.replace(targetObject, '${path}', value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => (
          v.val() === previousValue
          && target.games['Half-Life'] !== previousValue
          && target.games['Half-Life'] === value
        ),
      ),
    );
  });
});
requestsArrayProperties.forEach((path) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const middleNode = target.books[hhgg()][0];
    const previousValue = middleNode.name;

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer.replace(targetObject, '${path}', value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => (
          v.val() === previousValue
          && middleNode.name !== previousValue
          && middleNode.name === value
        ),
      ),
    );
  });
});
requestsArrayNonStandardProperties.forEach((path, i) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const middleNode = target.books[hhgg()];
    const previousValue = (() => {
      switch (i) {
        case 0: return middleNode.info.name;
        case 1: return middleNode[13];
        case 2: return middleNode[42];
        default: return undefined;
      }
    })();
    const comparer = (v, prev, cur) => v === prev && cur !== prev && cur === value;

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer.replace(targetObject, '${path}', value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => {
          const val = v.val();

          switch (i) {
            case 0: return comparer(val, previousValue, middleNode.info.name);
            case 1: return comparer(val, previousValue, middleNode[13]);
            case 2: return comparer(val, previousValue, middleNode[42]);
            default: return false;
          }
        },
      ),
    );
  });
});
requestsNullableProperties.forEach((path, i) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const middleNode = target.books[hhgg()];
    const isEqual = (a, b) => {
      if (a === b) {
        return true;
      }
      if (Number.isNaN(a) && Number.isNaN(b)) {
        return true;
      }
      return false;
    };
    const comparer = (v, prev, cur) => isEqual(v, prev) && cur !== prev && cur === value;
    const previousValue = (() => {
      switch (i) {
        case 0: return middleNode[2].read;
        case 1: return middleNode[3].read;
        case 2: return middleNode[5].year;
        case 3: return target.games['Half-Life'][4];
        default: return undefined;
      }
    })();

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer.replace(targetObject, '${path}', value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => {
          const val = v.val();

          switch (i) {
            case 0: return comparer(val, previousValue, middleNode[2].read);
            case 1: return comparer(val, previousValue, middleNode[3].read);
            case 2: return comparer(val, previousValue, middleNode[5].year);
            case 3: return comparer(val, previousValue, target.games['Half-Life'][4]);
            default: return false;
          }
        },
      ),
    );
  });
});
requestsByMixedType.forEach((path) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const middleNode = target.games['Half-Life'][0];
    const previousValue = middleNode.year;

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer.replace(targetObject, [${joinSplittedPath(path)}], value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => (
          v.val() === previousValue
          && middleNode.year !== previousValue
          && middleNode.year === value
        ),
      ),
    );
  });
});
requestsInfinityValue.forEach((path) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const middleNode = target.books[hhgg()][Infinity];
    const previousValue = middleNode.name;

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer.replace(targetObject, [${joinSplittedPath(path)}], value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => (
          v.val() === previousValue
          && middleNode.name !== previousValue
          && middleNode.name === value
        ),
      ),
    );
  });
});

/** Test bummer(object).replace(path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer, target) => {
    const value = Symbol('Value');
    const previousValue = target.games['Half-Life'];

    logResults(
      'Bummer.replace: Should replace the property value by the existing path with the new value',
      `bummer(targetObject).replace('${path}', value)`,
      testLauncher(
        () => bummer(target).replace(path, value),
        (v) => (
          v.val() === previousValue
          && target.games['Half-Life'] !== previousValue
          && target.games['Half-Life'] === value
        ),
      ),
    );
  });
});

/** Test bummer.replace(object, path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Bummer.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. New value has to be setted up by the path '
      + 'successfully.'
    );
    logResults(
      message,
      `bummer.replace({}, '${path}', value)`,
      testLauncher(
        () => bummer.replace(target, path, value),
        (v) => v.val() === undefined && target.games && target.games['Half-Life'] === value,
      ),
    );
  });
});

/** Test bummer(object).replace(path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Bummer.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. New value has to be setted up by the path '
      + 'successfully.'
    );
    logResults(
      message,
      `bummer({}).replace('${path}', value)`,
      testLauncher(
        () => bummer(target).replace(path, value),
        (v) => v.val() === undefined && target.games && target.games['Half-Life'] === value,
      ),
    );
  });
});

/** Test bummer.replace(object, path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Bummer.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. Object structure should be unchanged.'
    );
    logResults(
      message,
      `bummer.replace({}, '${path}', value, false)`,
      testLauncher(
        () => bummer.replace(target, path, value, false),
        (v) => v.val() === undefined && !has(target, 'games'),
      ),
    );
  });
});

/** Test bummer(object).replace(path, value) */
requestsSimple.forEach((path) => {
  tests.push((bummer/* , target */) => {
    const target = {};
    const value = Symbol('Value');
    const message = (
      'Bummer.replace: Should try to replace the value by non-existing path with the new value. '
      + 'Returned value expected: <undefined>. Object structure should be unchanged.'
    );
    logResults(
      message,
      `bummer({}).replace('${path}', value, false)`,
      testLauncher(
        () => bummer(target).replace(path, value, false),
        (v) => v.val() === undefined && !has(target, 'games'),
      ),
    );
  });
});


/** SPECIAL */

/** Summary */
tests.push((/* bummer, target */) => {
  log(
    'SUMMARY:\n',
    `> Total: ${testCounter}\n`,
    `> Success: ${summary[SUCCESS]}\n`,
    `> Fails: ${summary[FAIL]}\n`,
    `>> Errors: ${summary.errors}`,
  );
});


module.exports = { tests };
