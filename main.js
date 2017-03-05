#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var path = require('path');
var socketBuilder = require('./socketHandler');
var mimeHelper = require('./mimeHelper');

var devEnvironment = process.env.NODE_ENV === "development";

var port = 5000;

 
var server = http.createServer(function(request, response) {
  var fileName = "src";
  if (request.url.length === 0 || request.url === "/"){
    fileName += "/index.html";
  }
  else{
    fileName += request.url;
  }
  var mimeType = mimeHelper(fileName);

  fs.readFile(fileName, function(err, data){
    if (err){
       console.error(err);
       response.writeHead(404);
       response.end();
    }
    else{      
      response.writeHead(200, {'Content-Type': mimeType});
      if (mimeType.indexOf("text") > -1){
        response.end(data.toString());
      }
      else{
        response.end(data);
      }
      
    }    
  });
});
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

socketBuilder.createSocket(server);
