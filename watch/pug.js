const pug = require('pug');
const fs = require('fs');

const compiler = pug.compileFile('index.pug');

let rse = compiler()

fs.writeFileSync('./0Export/index.html', rse)