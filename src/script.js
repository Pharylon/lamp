var socketAddress = "ws://" + window.location.host;

document.addEventListener('DOMContentLoaded', initizialize, false);

var socket;

function initizialize(){
  socket = new WebSocket(socketAddress, "lamp");
  initializeColorPicker();  
}

function initializeColorPicker(){
  ColorPicker(
  document.getElementById('slide'),
  document.getElementById('picker'),
  function(hex, hsv, rgb) {
    document.body.style.backgroundColor = hex;
    var myJson = JSON.stringify({
      red: rgb.r,
      blue: rgb.b,
      green: rgb.g
    });
    socket.send(myJson);
});
}
