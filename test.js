const builder = require('./build');
const { porter } = require('./dist/porter_test.js').default;
const { log, logError } = require('./porter-logger');
const { testSubject } = require('./testSubject.js');
const { tests } = require('./test-scripts.js');

builder()
  .then(() => {
    log('Running tests...');
    tests.forEach((test) => test(porter, testSubject));
  })
  .catch((e) => logError('FAIL. Something went wrong building scripts.\n', e));
