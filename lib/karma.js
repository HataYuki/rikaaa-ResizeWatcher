const karmaServer = require('karma').Server;

module.exports = karma = (config) => {
    const server = new karmaServer(config);
    server.start();
    return server;
}