const express = require('express')
const app = express()
const apiset = require('./set.js')
const bodyParser = require("body-parser");
const cors = require('cors');


app.use(bodyParser.json(), cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/', function (req, res) {
    console.log(req.body);
    res.send('Hello World')
})

app.post('/api/set', function (req, res) {
    apiset.ApiSet(req.body).then((r) => {
        res.send(r)
    }).catch(err => {
        //console.log(err);
        res.send(err)
    })
})

app.listen(3000)