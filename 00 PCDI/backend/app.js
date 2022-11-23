const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const apiFolder = '../../api';

function setRoute(route) {
    let handler = require(`${apiFolder}${route}.js`);
    app.all(`${route}`, handler)
}

function scanRoute(route) {
    fs.readdirSync(`./api${route}`).forEach(item=>{
        let parse = path.parse(item);
        
        if (!parse.ext)
        scanRoute(`/${parse.name}/`);
        else
        setRoute(`${route}${parse.name}`)
        // console.log(parse);
    })
}



app.listen(3001, ()=>console.log(`listening on port 3001...`))

module.exports = scanRoute;