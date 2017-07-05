var WebSocketServer = require('websocket').server;
var lights = require("./lights");
var weather = require("./weather");
var settings = require("./settings");

var weatherInterval = null;


var socketHandler = {
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
            if (weatherInterval) {
              clearInterval(weatherInterval);
            }
            var myJson = JSON.parse(message.utf8Data);
            socketHandler.setMode(myJson)
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
  },

  setMode: function (myJson) {
    if (myJson.mode === "manual") {
      lights(myJson.red, myJson.green, myJson.blue);
      saveManualSettingsOnTimeout(myJson);
    }
    else if (myJson.mode === "weather") {
      settings.saveSettings(myJson);
      setTemperateColor(myJson.zip);
      weatherInterval = setInterval(function () {
        setTemperateColor(myJson.zip);
      }, 1000 * 60 * 5);
    }
  }
}

function setTemperateColor(zip) {
  console.log("Getting Temp");
  weather.getTemperatureColors(zip, function (tempColor) {
    lights(tempColor.red, tempColor.green, tempColor.blue);
  });
}

var _settingsSaveTimeout = null;
function saveManualSettingsOnTimeout(json){
  if (_settingsSaveTimeout){
    clearTimeout(_settingsSaveTimeout);
  }
  _settingsSaveTimeout = setTimeout(function(){
    settings.saveSettings(json);
  }, 1000);
}

module.exports = socketHandler;