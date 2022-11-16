const child = process.argv[2];
const fs = require('fs');
const path = require('path');


function findTrg(trgName) {
    let target;
    
    const pages = fs.readdirSync('pages');
    const innerPagesNames = pages.filter(i=>path.parse(i).ext==='')
    
    innerPagesNames.forEach(i => {
        const content = fs.readdirSync(`pages/${i}`);
        let res = content.find(i=>path.parse(i).base === trgName)
        if (res)
        target = res;
        
    });

    return target
}

console.log(findTrg(process.argv[2]));