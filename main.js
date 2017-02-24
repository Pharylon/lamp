#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var path = require('path');
var socketBuilder = require('./socketHandler');
var mimeHelper = require('./mimeHelper');

var devEnvironment = process.env.NODE_ENV === "development";

var port = 8081// = devEnvironment ? 8081 : 80;

 
var server = http.createServer(function(request, response) {
  var file = "src";
  if (request.url.length === 0 || request.url === "/"){
    file += "/index.html";
  }
  else{
    file += request.url;
  }
  var mimeType = mimeHelper(file);

  fs.readFile(file, function(err, data){
    if (err){
       console.error(err);
       response.writeHead(404);
       response.end();
    }
    else{
      response.writeHead(200, {'Content-Type': mimeType});
      response.end(data.toString());
    }
    
  });

});
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

socketBuilder.createSocket(server);
