const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const compileSass = require('./sassCompiler');
const serveFolder = require('./liveServer');
const compilePage = require('./router');
const garbageChecker = require('./garbageChecker');

function compileAllPages() {
    // watchEmmiter.emit('stop');
    // watchEmmiter.removeAllListeners();

    const pages = fs.readdirSync('./pages', 'utf-8')
    pages.forEach(item => {
        itemPath = path.parse(item);
        if (itemPath.ext.toLowerCase() === '.pug')
            compilePage(itemPath.name)
    })

    // startWatch();
}

function watchDir(dir) {
    chokidar.watch(dir, { ignoreInitial: true }).on('change', (p, e) => {
        let dirPath = path.parse(p);

        switch (dirPath.ext.toLowerCase()) {
            case '.scss':
                compileSass()
                break;
            case '.pug':
                compileAllPages();
                break;
        }
    })
}


compileAllPages()
compileSass()

watchDir('styles')
watchDir('components')
watchDir('pages')

garbageChecker('pages')

serveFolder('0Export')