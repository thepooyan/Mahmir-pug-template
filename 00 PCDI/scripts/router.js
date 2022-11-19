const pug = require('pug');
const fs = require('fs');
const path = require('path');
const { crashed } = require('./crashHandler');

function cleanVD() {
    try {
        fs.rmdirSync('00 PCDI/virtualDOM', {recursive: true, force: true});
        fs.mkdirSync('00 PCDI/virtualDOM');
        fs.writeFileSync('00 PCDI/virtualDOM/.gitkeep', 'THIS FOLDER SHOULD BE KEPT IN GIT', 'utf-8');
    } catch (err) {
        console.log(err);
    }
}

function buildBase(page, isChild=false) {
    //build the base for the page
    const base = fs.readFileSync('00 PCDI/base/base.pug', 'utf-8');

    let modifiedBase = base.replace(/include .*/, `include ../virtualDOM/${page}`)
    if (isChild)
    modifiedBase = modifiedBase.replace('base(href="./")', 'base(href="../")')
    fs.writeFileSync('00 PCDI/base/base.pug', modifiedBase, 'utf-8');
    
    return function() {
        fs.writeFileSync('00 PCDI/base/base.pug', base, 'utf-8');
    }
}

function compileBase() {
    try {
        let compiler = pug.compileFile('00 PCDI/base/base.pug');
        let compiledFile = compiler()
        return compiledFile
    } catch(err) {
        crashed(err);
    }
}

function preCompile(file, page) {
    //href's pointing to a child item
    file = file.replaceAll(`href=">index"`, `href="/${page}.html"`)
    let res = [...file.matchAll(/(?<=href=")>.*?(?=")/g)];
    res.forEach(i=>{
        file = file.replace(i[0], `/${page}/${i[0].substring(1)}.html`)
    })
    
    return file
}

function compilePage(page) {
    cleanVD()

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

            //pre compile the page related issues into virtual dom
            const originalPage = fs.readFileSync(`pages/${page}.pug`, 'utf-8');
            let preCompiledFile = originalPage.replace(/include .*/, `include ./${page}/${child}`);
            preCompiledFile = preCompiledFile.replaceAll('#{currentPage}', `${child}`);
            preCompiledFile = preCompile(preCompiledFile, page);

            fs.writeFileSync(`00 PCDI/virtualDOM/${page}.pug`, preCompiledFile, 'utf-8');

            //compile the child itself
            fs.mkdirSync(`00 PCDI/virtualDOM/${page}`, {recursive: true});
            const originalChild = fs.readFileSync(`pages/${page}/${child}.pug`, 'utf-8')
            let preCompiledChild = preCompile(originalChild, page);
            fs.writeFileSync(`00 PCDI/virtualDOM/${page}/${child}.pug`, preCompiledChild, 'utf-8');
            
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