const pug = require('pug');
const fs = require('fs');
const path = require('path');

function compile() {
    let file = fs.readFileSync('layouts/layout1.pug', 'utf-8');
    let addChild = file.replace('#{child}', 'include ../pages/edit');
    fs.writeFileSync('layouts/layout1.pug', addChild, 'utf-8');
    const compiler = pug.compileFile('index.pug');
    let rse = compiler()
    fs.writeFileSync('./0Export/index.html', rse)
}
compile()

//watch depencies
const dir = fs.readdirSync('components', {encoding: 'utf-8'});
dir.forEach(item=>{
    if (path.extname(item).toLowerCase() === '.pug')
    fs.watch(`components/${item}`, 'utf-8', compile)
})

