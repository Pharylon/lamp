var socketAddress = "ws://" + window.location.host;

document.addEventListener('DOMContentLoaded', initizialize, false);

var socket;

function initizialize(){
  socket = new WebSocket(socketAddress, "lamp");
  initializeColorPicker();  
  initStopBtn();
}

var sendTimeout;

// function initializeColorPicker(){
//   ColorPicker(
//   document.getElementById('slide'),
//   document.getElementById('picker'),
//   function(hex, hsv, rgb) {
//     document.body.style.backgroundColor = hex;
//     var myJson = JSON.stringify({
//       red: rgb.r,
//       blue: rgb.b,
//       green: rgb.g
//     });
//     socket.send(myJson);
//   });
// }

function initStopBtn(){
  var btn = document.getElementById("stopbtn");
  btn.onclick = function(){
    var offJson = JSON.stringify({red: 0, blue: 0, green: 0});
    socket.send(offJson);
  }
}

var bCanPreview = true; // can preview


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

    picker.onclick = function (e) {
        bCanPreview = !bCanPreview;
    }
}

function setinputValue(id, value) {
    var input = document.getElementById(id);
    input.value = value;
}

function handleSelection(e){
  if (bCanPreview) {
    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');
    // get coordinates of current position
    var canvasOffset = getOffSet(canvas);// $(canvas).offset();
    var canvasX = Math.floor(e.pageX - canvasOffset.left);
    var canvasY = Math.floor(e.pageY - canvasOffset.top);

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
            

    var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
    setinputValue("hexVal", '#' + ('0000' + dColor.toString(16)).substr(-6));
  }
}

function getOffSet(element) {
    var leftOffset = element.offsetLeft;
    var topOffSet = element.offsetTop;
    var parent = element.parentElement;
    if (parent.tagName != "BODY") {
        var parentOffset = getOffSet(parent);
        if (parentOffset.left !== leftOffset || parentOffset.top !== topOffSet) {

        }

    }
    return {
        left: leftOffset,
        top: topOffSet
    }
}

function getOffSetOld(elem) {

    if (!elem || !elem.ownerDocument) {
        return null;
    }

    if (elem === elem.ownerDocument.body) {
        return jQuery.offset.bodyOffset(elem);
    }

    try {
        box = elem.getBoundingClientRect();
    } catch (e) { }

    var doc = elem.ownerDocument,
        docElem = doc.documentElement;

    // Make sure we're not dealing with a disconnected DOM node
    if (!box || !jQuery.contains(docElem, elem)) {
        return box || { top: 0, left: 0 };
    }

    var body = doc.body,
        win = getWindow(doc),
        clientTop = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        top = box.top + scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft;

    return { top: top, left: left };
};


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