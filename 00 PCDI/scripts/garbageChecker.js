const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

function garbageChecker(dir) {
    chokidar.watch(dir, { ignoreInitial: true }).on('unlink', (e) => {
        let deleted = path.parse(e)
        
        if (deleted.dir === 'pages')
        fs.existsSync(`0Export/${deleted.name}.html`) && fs.rmSync(`0Export/${deleted.name}.html`)
        else {
            if (deleted.name === "index") return
            else {
                let dir = deleted.dir.replace('pages/', '');
                
                if (fs.existsSync(`0Export/${dir}/${deleted.name}.html`)) {
                    fs.rmSync(`0Export/${dir}/${deleted.name}.html`)
                    console.log(`deleted file ${deleted.name}.html`);
                }

                if (fs.readdirSync(`0Export/${dir}`).length === 0) {
                    fs.rmdirSync(`0Export/${dir}`)
                    console.log(`deleted dir ${dir}`);
                }
            }
        }
    })

}

module.exports = garbageChecker;