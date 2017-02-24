var socket = new WebSocket("ws://localhost:8081/", "lamp");


document.addEventListener('DOMContentLoaded', initializeColorPicker, false);

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
