var AWSXRay = require('aws-xray-sdk-core');
var xrayExpress = require('aws-xray-sdk-express');
var express = require('express');
var app = express();
var logger = require('winston');

const healthCheckPath = '/health'

//dont trace healthcheck calls
var rules = {
  "rules": [ { "description": "Health", "service_name": "*", "http_method": "*", "url_path": healthCheckPath, "fixed_target": 0, "rate": 0.00 } ],
  "default": { "fixed_target": 1, "rate": 0.1 },
  "version": 1
}

AWSXRay.middleware.setSamplingRules(rules);
AWSXRay.setLogger(logger);
AWSXRay.captureHTTPsGlobal(require('http'));

const request = require("request"); //has to be declared after XRay global captures
const colorServiceUrl = process.env.COLOR_URL || "http://localhost"

app.use(express.static('static'))

app.get(healthCheckPath, function(req, res) {
    res.status(200).send('success');
});

app.use(xrayExpress.openSegment('dashboard'));
app.get('/api', function(req, res) {
  var headers = {}
  
  for (var key in req.headers) {

      if (key.startsWith("cldz")) {
          headers[key] = req.headers[key];
      }
  }

  console.log(headers);
  request.get({url: colorServiceUrl, headers: headers }, (error, response, body) => {
    if(error !== null){
      console.log(error)
    }
    console.log('got ' + body + ' from color controller');
    res.send(body);
  }); 

});



app.use(xrayExpress.closeSegment());

console.log('Color controller serving at '+colorServiceUrl)
app.listen(8080);
