const pug = require('pug');
const fs = require('fs');
const path = require('path');
const events = require('events');
const watchEmmiter = new events.EventEmitter();
const chokidar = require('chokidar');

function compile(page) {
    let pageChilds;
    let hasChildren = ()=>{
        if (fs.existsSync(`pages/${page}`) && fs.readdirSync(`pages/${page}`).length >= 1)
        return true
        else
        return false
    };

    if (hasChildren()) {
        pageChilds = fs.readdirSync(`pages/${page}`, 'utf-8');
        pageChilds.forEach(item => {
            let child = path.parse(item).name;
            console.log(`compiling ${page} => ${child}`)

            //pre compile into virtual dom
            const originalFile = fs.readFileSync(`pages/${page}.pug`, 'utf-8');
            let preCompiledFile = originalFile.replace(/include .*/, `include ../../../pages/${page}/${child}`);
            preCompiledFile = preCompiledFile.replaceAll('#{currentPage}', `${child}`);

            fs.writeFileSync(`00 PCDI/virtualDOM/pages/${page}.pug`, preCompiledFile, 'utf-8');

            //build the base for the page
            const base = fs.readFileSync('00 PCDI/base/base.pug', 'utf-8');
            let modifiedBase = base.replace(/include .*/, `include ../virtualDOM/pages/${page}`)
            fs.writeFileSync('00 PCDI/base/base.pug', modifiedBase, 'utf-8');

            //final compile and export
            let compiler = pug.compileFile('00 PCDI/base/base.pug');
            let compiledFile = compiler()
            if (child !== 'index') {
                fs.mkdirSync(`./0Export/${page}`, {recursive: true});
                fs.writeFileSync(`./0Export/${page}/${child}.html`, compiledFile)
            } else {
                fs.writeFileSync(`./0Export/${page}.html`, compiledFile)
            }
        })
    } else {
        console.log(`compiling ${page}...`)

        const base = fs.readFileSync('00 PCDI/base/base.pug', 'utf-8');
        let modifiedBase = base.replace(/include .*/, `include ../../pages/${page}`)
        fs.writeFileSync('00 PCDI/base/base.pug', modifiedBase, 'utf-8');

        let compiler = pug.compileFile('00 PCDI/base/base.pug');
        let compiledFile = compiler()
        fs.writeFileSync(`./0Export/${page}.html`, compiledFile)

        //restore the base files
        fs.writeFileSync('00 PCDI/base/base.pug', base, 'utf-8');
    }

}


//watch depencies
function watchDir(dirName) {
    // let watcher = fs.watch(`${dirName}`, 'utf-8', compileAllPages)
    let watcher = chokidar.watch(`${dirName}`, {ignoreInitial: true});
    watcher.on('all', compileAllPages);

    watchEmmiter.on('stop',() => {
        watcher.close();
    })
    console.log(`watching ${dirName}...`)
}

function startWatch() {
    watchDir('components/')
    watchDir('pages/')
}

function compileAllPages() {
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

compileAllPages()