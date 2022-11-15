const events = require('events')
const watchEmmiter = new events.EventEmitter();
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const compileSass = require('./sassCompiler');
const serveFolder = require('./liveServer');
const compilePage = require('./router');

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

function garbageChecker(dir) {
    chokidar.watch(dir, { ignoreInitial: true }).on('unlink', (e) => {
        let deleted = path.parse(e)
        
        if (deleted.dir === 'pages')
        fs.existsSync(`0Export/${deleted.name}.html`) && fs.rmSync(`0Export/${deleted.name}.html`)
        else {
            if (deleted.name === "index") return
            else {
                let dir = deleted.dir.replace('pages/', '');
                fs.existsSync(`0Export/${dir}/${deleted.name}.html`) && fs.rmSync(`0Export/${dir}/${deleted.name}.html`)
                console.log(`deleted file ${deleted.name}.html`);

                if (fs.readdirSync(`0Export/${dir}`).length === 0)
                fs.rmdirSync(`0Export/${dir}`)
                console.log(`deleted dir ${dir}`);
            }
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