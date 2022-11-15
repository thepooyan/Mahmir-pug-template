const fs = require('fs');


function compilePages() {
    // watchEmmiter.emit('stop');
    // watchEmmiter.removeAllListeners();

    const pages = fs.readdirSync('./pages', 'utf-8')
    pages.forEach(item => {
        itemPath = path.parse(item);
        if (itemPath.ext.toLowerCase() === '.pug')
            compilePage(itemPath.name)
    })

    // startWatch();
}

watchDir('styles')
watchDir('components')
watchDir('pages')