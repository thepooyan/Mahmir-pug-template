const pug = require('pug');
const fs = require('fs');
const path = require('path');


function buildBase(page, isChild=false) {
    //build the base for the page
    const base = fs.readFileSync('00 PCDI/base/base.pug', 'utf-8');

    let modifiedBase = base.replace(/include .*/, `include ../virtualDOM/${page}`)
    if (isChild)
    modifiedBase = base.replace("Content/style.css", "../Content/style.css")
    fs.writeFileSync('00 PCDI/base/base.pug', modifiedBase, 'utf-8');
    
    return function() {
        fs.writeFileSync('00 PCDI/base/base.pug', base, 'utf-8');
    }
}
function compileBase() {
    let compiler = pug.compileFile('00 PCDI/base/base.pug');
    let compiledFile = compiler()
    return compiledFile
}
function preCompile(file, page) {

    file = file.replaceAll(`href=">index"`, `href="/${page}.html"`)

    let res = [...file.matchAll(/(?<=href=")>.*?(?=")/g)];
    
    res.forEach(i=>{
        file = file.replace(i[0], `/${page}/${i[0].substring(1)}.html`)
    })
    
    return file
}
function compilePage(page) {
    let pageChilds;
    let hasChildren = () => {
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

            //pre compile the child related issues into virtual dom
            const originalFile = fs.readFileSync(`pages/${page}.pug`, 'utf-8');
            let preCompiledFile = originalFile.replace(/include .*/, `include ../../pages/${page}/${child}`);
            preCompiledFile = preCompiledFile.replaceAll('#{currentPage}', `${child}`);
            preCompiledFile = preCompile(preCompiledFile, page);

            fs.writeFileSync(`00 PCDI/virtualDOM/${page}.pug`, preCompiledFile, 'utf-8');

            
            //final compile and export
            if (child !== 'index') {
                let restore = buildBase(page, true);
                fs.mkdirSync(`./0Export/${page}`, { recursive: true });
                fs.writeFileSync(`./0Export/${page}/${child}.html`, compileBase())
                restore();
            } else {
                buildBase(page);
                fs.writeFileSync(`./0Export/${page}.html`, compileBase())
            }
        })
    } else {
        console.log(`compiling ${page}...`)
        const originalFile = fs.readFileSync(`pages/${page}.pug`, 'utf-8');
        let preCompiledFile = preCompile(originalFile, page);
        fs.writeFileSync(`00 PCDI/virtualDOM/${page}.pug`, preCompiledFile, 'utf-8');


        buildBase(page);
        fs.writeFileSync(`./0Export/${page}.html`, compileBase())
    }

}

module.exports = compilePage;