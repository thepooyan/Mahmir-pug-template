const pug = require('pug');
const fs = require('fs');
const path = require('path');
const events = require('events');
const watchEmmiter = new events.EventEmitter();

function compile() {
    watchEmmiter.emit('stop');
    watchEmmiter.removeAllListeners();
    const pages = fs.readdirSync('children', 'utf-8');
    pages.forEach(item => {
        let name = path.parse(item).name;
        console.log(`compiling child ${name}...`)

        const originalFile = fs.readFileSync('pages/index.pug', 'utf-8');
        let preCompiledFile = originalFile.replace(/include .*/, `include ../children/${name}`);
        preCompiledFile = preCompiledFile.replaceAll('#{currentPage}', `"${name}"`);
        
        fs.writeFileSync('pages/index.pug', preCompiledFile, 'utf-8');

        let compiler = pug.compileFile('00 PCDI/base/base.pug');
        let compiledFile = compiler()
        fs.writeFileSync(`./0Export/${name}.html`, compiledFile)

        //restore the base file
        fs.writeFileSync('pages/index.pug', originalFile, 'utf-8');
    })
    startWatch();
}

//watch depencies
function watchDir(dirName) {
    const dir = fs.readdirSync(dirName, { encoding: 'utf-8' });;
    dir.forEach(item => {
        if (path.extname(item).toLowerCase() === '.pug') {
            let watcher = fs.watch(`${dirName}${item}`, 'utf-8', compile)
            watchEmmiter.on('stop', ()=>{
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

compile()
