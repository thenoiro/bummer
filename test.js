const builder = require('./build');
const porter = require('./dist/porter_test.js').default;
const { log, logError } = require('./porter-logger');
const { getTestSubject } = require('./testSubject.js');
const { tests } = require('./test-scripts.js');

builder()
  .then(() => {
    log('...running tests...');
    tests.forEach((test) => test(porter, getTestSubject()));
  })
  .catch((e) => logError('FAIL. Something went wrong building scripts.\n', e));
