const watchEmmiter = new events.EventEmitter();
const chokidar = require('chokidar');

const compileSass = require('./sassCompiler');
const serveFolder = require('./liveServer');
const compilePage = require('./router');

function watchSCSS(dir) {
    chokidar.watch(dir, {ignoreInitial: true}).on('all', (event, p)=>{
        let dirPath = path.parse(p);
        if (dirPath.ext === '.scss') {
            compileSass()
            console.log(`${dirPath.base} changed.`);
        }
    })
    console.log(`watching ${dir} for styles...`)
}
watchSCSS('components')
watchSCSS('pages')

//watch depencies
function watchDir(dirName) {
    
    let watcher = chokidar.watch(`${dirName}`, { ignoreInitial: true });
    watcher.on('change', compilePages);
    watcher.on('unlink', (e)=>{
        // console.log(e,a);
        let deleted = path.parse(e)
        if (deleted.dir === 'components') return

        if (deleted.dir === 'pages')
        fs.existsSync(`0Export/${deleted.name}.html`) && fs.rmSync(`0Export/${deleted.name}.html`)
        else {
            if (deleted.name === "index") return
            else {
                let dir = deleted.dir.replace('pages/', '');
                fs.existsSync(`0Export/${dir}/${deleted.name}.html`) && fs.rmSync(`0Export/${dir}/${deleted.name}.html`)
                if (fs.readdirSync(`0Export/${dir}`).length === 0)
                fs.rmdirSync(`0Export/${dir}`)
            }
        }
    });

    watchEmmiter.on('stop', () => {
        watcher.close();
    })
    console.log(`watching ${dirName}...`)
}

function startWatch() {
    watchDir('components/')
    watchDir('pages/')
}

function compilePages() {
    // startWatch();return 0;
    watchEmmiter.emit('stop');
    watchEmmiter.removeAllListeners();

    const pages = fs.readdirSync('./pages', 'utf-8')
    pages.forEach(item => {
        itemPath = path.parse(item);
        if (itemPath.ext.toLowerCase() === '.pug')
            compile(itemPath.name)
    })

    startWatch();
}