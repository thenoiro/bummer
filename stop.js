const fkill = require('fkill');

try {
    fkill(':8080', {
        force: true,
        silent: true,
    });
} catch (ex) {
    console.error(ex);
}