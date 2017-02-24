#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var PythonShell = require('python-shell');


 
var server = http.createServer(function(request, response) {
  var mimeType = getMimeType(request.url);
  var file = "src";
  if (request.url.length === 0 || request.url === "/"){
    file += "/index.html";
  }
  else{
    file += request.url;
  }

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
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    // var echoConnection = request.accept('echo-protocol', request.origin);
    // console.log((new Date()) + ' Echo Connection accepted.');
    // echoConnection.on('message', function(message) {
    //     if (message.type === 'utf8') {
    //         console.log('Received Message: ' + message.utf8Data);
    //         echoConnection.sendUTF(message.utf8Data);
    //     }
    //     else if (message.type === 'binary') {
    //         console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    //         echoConnection.sendBytes(message.binaryData);
    //     }
    // });
    // echoConnection.on('close', function(reasonCode, description) {
    //     console.log((new Date()) + ' Peer ' + echoConnection.remoteAddress + ' disconnected (Echo).');
    // });

    var lampConnection = request.accept('lamp', request.origin);
    console.log((new Date()) + ' Lamp Connection accepted.');
    lampConnection.on('message', function(message) {
        if (message.type === 'utf8') {
            var rgb = JSON.parse(message.utf8Data);
            PythonShell.run('lamp.py', {args: [rgb.red, rgb.green, rgb.blue]}, function (err, results) {
              if (err) throw err;
              // results is an array consisting of messages collected during execution
              console.log('results: %j', results);
            });
            //lampConnection.sendUTF(message.utf8Data);
        }
    });
    lampConnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + lampConnection.remoteAddress + ' disconnected (from Lamp).');
    });
});


function getMimeType(url){
  if (url.indexOf(".") === -1){
    return "text/html";
  }
  else{
    var split = url.split('.');
    var extension = split[split.length - 1];
    if (extension === "js"){
      return "text/javascript";
    }
    if (extension === "html"){
      return "text/html";
    }
    if (extension === "css"){
      return "text/css";
    }
    return "text/plain"
  }
  
}