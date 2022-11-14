var liveServer = require("live-server");

function serveRoot(root) {
    let params = { root: root };
    liveServer.start(params);
}

module.exports = serveRoot;