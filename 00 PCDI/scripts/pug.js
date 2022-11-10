const pug = require('pug');
const fs = require('fs');
const path = require('path');
const events = require('events');
const watchEmmiter = new events.EventEmitter();

function compile(page) {

    let pageChilds;
    if (fs.existsSync(`pages/${page}`)) {
        pageChilds = fs.readdirSync(`pages/${page}`, 'utf-8');
        pageChilds.forEach(item => {
            let child = path.parse(item).name;
            console.log(`compiling child ${child} of ${page}...`)

            const originalFile = fs.readFileSync(`pages/${page}.pug`, 'utf-8');
            let preCompiledFile = originalFile.replace(/include .*/, `include ${page}/${child}`);
            preCompiledFile = preCompiledFile.replaceAll('#{currentPage}', `"${child}"`);

            fs.writeFileSync(`pages/${page}.pug`, preCompiledFile, 'utf-8');

            const base = fs.readFileSync('00 PCDI/base/base.pug', 'utf-8');
            let modifiedBase = base.replace(/include .*/, `include ../../pages/${page}`)
            fs.writeFileSync('00 PCDI/base/base.pug', modifiedBase, 'utf-8');

            let compiler = pug.compileFile('00 PCDI/base/base.pug');
            let compiledFile = compiler()
            fs.writeFileSync(`./0Export/${page}-${child}.html`, compiledFile)

            //restore the base files
            fs.writeFileSync(`pages/${page}.pug`, originalFile, 'utf-8');
            fs.writeFileSync('00 PCDI/base/base.pug', base, 'utf-8');
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
    const dir = fs.readdirSync(dirName, { encoding: 'utf-8' });;
    dir.forEach(item => {
        if (path.extname(item).toLowerCase() === '.pug') {
            let watcher = fs.watch(`${dirName}${item}`, 'utf-8', compileAllPages)
            watchEmmiter.on('stop', () => {
                watcher.close();
            })
            console.log(`watching ${dirName}${item}...`)
        }
    })
}
function startWatch() {
    watchDir('components/')
    watchDir('children/')
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