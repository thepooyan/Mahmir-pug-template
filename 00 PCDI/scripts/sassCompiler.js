const sass = require('sass');
const fs = require('fs');

function compileSass() {
    const css = sass.compile('00 PCDI/base/base.scss')
    fs.writeFileSync('0Export/Content/style.css', css.css, 'utf-8')
    console.log('compiling sass...');
}

module.exports = compileSass;