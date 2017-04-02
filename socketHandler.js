var WebSocketServer = require('websocket').server;
var lights = require("./lights");
var weather = require("./weather");

var weatherInterval = null;


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
            if (weatherInterval){
              clearInterval(weatherInterval);
            }
            var myJson = JSON.parse(message.utf8Data);
            if (myJson.mode === "manual"){
              lights(myJson.red, myJson.green, myJson.blue);
            }
            else if (myJson.mode === "weather"){
              setTemperateColor();
              weatherInterval = setInterval(setTemperateColor, 1000 * 60 * 5);
            }
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


function setTemperateColor(){
  console.log("Getting Temp");
  weather.getTemperaturColors(function(tempColor){
    lights(tempColor.red, tempColor.green, tempColor.blue);
  });  
}