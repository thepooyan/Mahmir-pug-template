const pug = require('pug');
const fs = require('fs');
const path = require('path');

function compile() {
    const pages = fs.readdirSync('layouts/pages','utf-8');
    pages.forEach(item=>{
        console.log('compiling...')
        let name = path.parse(item).name;
        let file = fs.readFileSync('layouts/layout1.pug', 'utf-8');
        let addChild = file.replace(/include .*/, `include pages/${name}`);
        fs.writeFileSync('layouts/layout1.pug', addChild, 'utf-8');
        let compiler = pug.compileFile('index.pug');
        let rse = compiler()
        fs.writeFileSync(`./0Export/${name}.html`, rse)
    })
}
compile()

//watch depencies
const dir = fs.readdirSync('layouts/pages/', {encoding: 'utf-8'});
dir.forEach(item=>{
    if (path.extname(item).toLowerCase() === '.pug')
    fs.watch(`layouts/pages/${item}`, 'utf-8', compile)
})

