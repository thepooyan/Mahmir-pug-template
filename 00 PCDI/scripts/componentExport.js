const child = process.argv[2];
const fs = require('fs');
const path = require('path');
const pug = require('pug')


function findTrg(trgName) {
    let target;
    
    const pages = fs.readdirSync('pages');
    const innerPagesNames = pages.filter(i=>path.parse(i).ext==='')
    
    innerPagesNames.forEach(inner => {
        const content = fs.readdirSync(`pages/${inner}`);
        let res = content.find(i=>path.parse(i).name === trgName && path.parse(i).ext.toLowerCase() === '.pug')
        if (res) {
            target = `./pages/${inner}/${res}`;
        }
    });

    return target
}

let found = findTrg(child)
let compiler = pug.compileFile(found, {pretty: true});
let compiledFile = compiler()

fs.mkdirSync('0StaticExport', {recursive: true})
fs.writeFileSync(`0StaticExport/${child}.html`, compiledFile, 'utf-8');

console.log(found);