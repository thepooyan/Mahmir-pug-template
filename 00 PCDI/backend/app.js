const express = require('express');
const app = express();

const route1 = require('../../api/test.js');

app.all('/test', route1)

app.listen(3000, ()=>console.log(`listening on port 3000...`))