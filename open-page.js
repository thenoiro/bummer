const open = require('open');
const { log/* , logError */ } = require('./porter-logger.js');


/* Open page (<url>) in the browser */
module.exports = async (url) => {
  log('Opening page in browser...');
  await open(url);
  log('Enjoy!');
};
