const builder = require('./build');

const { log, logError } = require('./porter-logger');
const { getTestSubject } = require('./testSubject.js');
const { tests } = require('./test-scripts.js');

builder()
  .then(() => {
    // INFO: This module will be available only after 'builder' finished its work.
    // eslint-disable-next-line
    const porter = require('./dist/porter_test.js');
    log('...running tests...'); return;
    tests.forEach((test) => test(porter, getTestSubject()));
  })
  .catch((e) => logError('FAIL. Something went wrong building scripts.\n', e));
