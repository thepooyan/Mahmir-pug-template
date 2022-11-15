const liveServer = require("live-server");

function serveFolder(root) {
    let params = { root: root };
    liveServer.start(params);
}

module.exports = serveFolder;