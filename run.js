/* Constants */
const env = process.env.NODE_ENV || 'development';
const { argv } = process;
const isOpen = argv.includes('--open');

/* Dependencies */
const server = require('./server.js');

server(env, isOpen);
