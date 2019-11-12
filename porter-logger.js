module.exports = {
    log(...args) {
        porterLogger('log', ...args);
    },
    logError(...args) {
        porterLogger('error', ...args)
    },
};


function porterLogger(type, ...args) {
    const prefix = '\n>>> PORTER:\n';

    switch (type) {
        case 'error':
            return console.error(prefix, ...args);
        case 'log':
        default:
            return console.log(prefix, ...args);
    }
}
