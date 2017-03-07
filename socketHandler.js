var WebSocketServer = require('websocket').server;
var PythonShell = require('python-shell');
var path = require('path');
var devEnvironment = process.env.NODE_ENV === "development";
var pythonFile = path.join("python", devEnvironment ? "print.py" : "lamp.py");


//Set color to red at boot
PythonShell.run(pythonFile, { args: [0, , 1] }, function(){});

module.exports = {
  createSocket: function (server) {
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

    wsServer.on('request', function (request) {
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin 
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }

      try {
        var lampConnection = request.accept('lamp', request.origin);
        console.log((new Date()) + ' Lamp Connection accepted.');
        lampConnection.on('message', function (message) {
          if (message.type === 'utf8') {
            var rgb = JSON.parse(message.utf8Data);
            PythonShell.run(pythonFile, { args: [rgb.red, rgb.green, rgb.blue] }, function (err, results) {
              if (err){
                console.error(err)
              }
              else{
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
              }              
            });
            //lampConnection.sendUTF(message.utf8Data);
          }
        });
        lampConnection.on('close', function (reasonCode, description) {
          console.log((new Date()) + ' Peer ' + lampConnection.remoteAddress + ' disconnected (from Lamp).');
        });
      }
      catch (err) {
        console.log(err);
      }


    });
  }
}
