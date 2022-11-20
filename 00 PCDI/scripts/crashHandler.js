const chokidar = require('chokidar');
const fs = require('fs');
const { compileAllPages } = require('./watcher');

function crashed(err) {
    console.log(err);
    console.log('wariting for file changes...');

    const error = fs.readFileSync(err.filename, 'utf-8');
    let resolved = false;

    do {
        let check = fs.readFileSync(err.filename, 'utf-8');
        if (check!==error) resolved = true;
    } while (!resolved)

    console.log('resolved!');
    compileAllPages()
}

module.exports.crashed = crashed;