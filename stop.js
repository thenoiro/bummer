const fkill = require('fkill');

const inform = console;

try {
  fkill(':8080', {
    force: true,
    silent: true,
  });
} catch (ex) {
  inform.error(ex);
}
