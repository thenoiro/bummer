const builder = require('./build');

const { log, logError } = require('./bummer-logger');
const { getTestSubject } = require('./testSubject.js');
const { tests } = require('./test-scripts.js');

builder()
  .then(() => {
    // INFO: This module will be available only after 'builder' finished its work.
    // eslint-disable-next-line
    const bummer = require('./dist/bummer_test.js');
    log('...running tests...');
    tests.forEach((test) => test(bummer, getTestSubject()));
  })
  .catch((e) => logError('FAIL. Something went wrong building scripts.\n', e));
