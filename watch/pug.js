const pug = require('pug');
const fs = require('fs');
const path = require('path');

function compile() {
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

