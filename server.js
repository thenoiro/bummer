/* Dependencies */
const express = require('express');
const openPage = require('./open-page.js');
const { log/* , logError */ } = require('./bummer-logger.js');


/* Simple express static server */
module.exports = (env/*  = 'production' */, isOpen = false) => {
  const host = /* env === 'production' ? '0.0.0.0' :  */'127.0.0.1';
  const port = /* env === 'production' ? '80' :  */'8080';
  const url = `http://${host}:${port}/`;
  const successMessage = `Server has started successfully at ${url}.`;

  const staticPath = express.static('dist');
  const server = express();

  server.use(staticPath);
  server.listen(port, () => {
    log(successMessage);

    if (isOpen) {
      openPage(url);
    }
  });
};
