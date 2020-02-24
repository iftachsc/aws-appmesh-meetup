var express = require('express');
const request = require("request");
const http = require('http');
var app = express();
var path = require('path');

const colorServiceUrl = process.env.COLOR_URL || "http://localhost"

// viewed at http://localhost:8080
app.use(express.static('static'))

app.get('/api', function(req, res) {
  
  request.get(colorServiceUrl, (error, response, body) => {
    console.log('got ' + body + ' from color controller');
    res.send(body);
  }); 

});


console.log('Color controller serving at '+colorServiceUrl)
app.listen(8090);
