var socketAddress = "ws://" + window.location.host;

document.addEventListener('DOMContentLoaded', initizialize, false);

var socket;

function initizialize(){
  socket = new WebSocket(socketAddress, "lamp");
  initializeColorPicker();  
  initStopBtn();
}

var sendTimeout;

function initStopBtn(){
  var btn = document.getElementById("stopbtn");
  btn.onclick = function(){
    var offJson = JSON.stringify({red: 0, blue: 0, green: 0});
    socket.send(offJson);
  }
}


function initializeColorPicker() {

    var picker = document.getElementById("picker");

    // create canvas and context objects
    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');

    // drawing active image
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }

    // select desired colorwheel
    var imageSrc = 'images/colorwheel1.png';
    switch (canvas.getAttribute('var')) {
        case '2':
            imageSrc = 'images/colorwheel2.png';
            break;
        case '3':
            imageSrc = 'images/colorwheel3.png';
            break;
        case '4':
            imageSrc = 'images/colorwheel4.png';
            break;
        case '5':
            imageSrc = 'images/colorwheel5.png';
            break;
    }
    image.src = imageSrc;

    picker.onmousemove = handleSelection;
    picker.ontouchmove = handleSelection;
}

function setinputValue(id, value) {
    var input = document.getElementById(id);
    input.value = value;
}

function handleSelection(e){
    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');
    // get coordinates of current position
    var canvasOffset = getOffSet(canvas);// $(canvas).offset();
    var coordinates = getCoordinates(e);
    var canvasX = Math.floor(coordinates.x - canvasOffset.left);
    var canvasY = Math.floor(coordinates.y - canvasOffset.top);

    var totalOffset = getOffSet(canvas);

    // get current pixel
    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    var pixel = imageData.data;

    // update preview color
    var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";

    document.getElementById("preview").style.backgroundColor = pixelColor;


    // update controls
    setinputValue("rVal", pixel[0]);
    setinputValue("gVal", pixel[1]);
    setinputValue("bVal", pixel[2]);
    setinputValue("rgbVal", pixel[0] + ',' + pixel[1] + ',' + pixel[2]);

    
    clearTimeout(sendTimeout);
    sendTimeout = setTimeout(function(){              
      var myJson = JSON.stringify({
        red: pixel[0],
        green: pixel[1],
        blue: pixel[2]
      });
      socket.send(myJson);
    }, 20);
            
    console.log(e);

    var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
    setinputValue("hexVal", '#' + ('0000' + dColor.toString(16)).substr(-6));
}

function getCoordinates(e){
    if (e.type === "mousemove"){
        return{
            y: e.pageY,
            x: e.pageX 
        }
    }
    else if (e.touches){
        var t = e.touches[0];
        return{
            x: t.pageX,
            y: t.pageY
        }
    }
}

function getOffSet(elem) {
    if (!elem) {
        return;
    }

    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!elem.getClientRects().length) {
        return { top: 0, left: 0 };
    }

    rect = elem.getBoundingClientRect();

    // Make sure element is not hidden (display: none)
    if (rect.width || rect.height) {
        doc = elem.ownerDocument;
        win = window;
        docElem = doc.documentElement;

        return {
            top: rect.top + win.pageYOffset - docElem.clientTop,
            left: rect.left + win.pageXOffset - docElem.clientLeft
        };
    }

    // Return zeros for disconnected and hidden elements (gh-2310)
    return rect;
}
