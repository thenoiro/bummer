const builder = require('./build');
const { log, logError } = require('./porter-logger');

builder()
    .then(() => {
        log('Running tests...');
        testPorter();
    })
    .catch(() => logError(`FAIL. Something went wrong building scripts.`));


function testPorter() {
    // TODO: Implement tests
    // const porter = require('./dist/porter_test.js');
    // const subject = require('./test_subject.js);
}