var cursorAngle = 0
var MOUSE_DISTANCE_CAP = 100
function onMouseMove(event) {
  if(hasPointerLock()) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
    screenMouseX += movementX * CAMERA_SPEED
    screenMouseY += movementY * CAMERA_SPEED
    screenMouseDistance = Math.sqrt(screenMouseX * screenMouseX + screenMouseY * screenMouseY)
    if(screenMouseDistance > MOUSE_DISTANCE_CAP) {
      screenMouseX = screenMouseX / screenMouseDistance * MOUSE_DISTANCE_CAP;
      screenMouseY = screenMouseY / screenMouseDistance * MOUSE_DISTANCE_CAP;
    }
  }
  else
  {
    // standard shim to make offsetX/Y work crossbrowser
    var target = event.target || event.srcElement,
          rect = target.getBoundingClientRect();
    
    screenMouseX = event.clientX - rect.left - halfCanvas,
    screenMouseY = event.clientY - rect.top - halfCanvas
  }
  cursorAngle = Math.atan2(screenMouseY, screenMouseX)
}

function onKeyDown(event) {
  switch(event.keyCode) {
    case 87: // W
    case 38: // up arrow
    case 188: // , (dvorak w)
      playerThrust = 1
      break;
    case 65: // A (also dvorak)
    case 37: // left arrow
      playerTurnThrust = -1
      break;
    case 68: // D
    case 39: // right arrow
    case 69: // E (dvorak d)
      playerTurnThrust = 1
      break;
  }
}
function onKeyUp(event) {
  switch(event.keyCode) {
    case 87: // W
    case 38: // up arrow
    case 188: // , (dvorak w)
      playerThrust = 0
      break;
    case 65: // A (also dvorak)
    case 37: // left arrow
      if(playerTurnThrust == -1) playerTurnThrust = 0
      break;
    case 68: // D
    case 39: // right arrow
    case 69: // E (dvorak d)
      if(playerTurnThrust == 1) playerTurnThrust = 0
      break;
  }
}

function hasPointerLock() {
  return (document.pointerLockElement === canvas ||
  document.mozPointerLockElement === canvas ||
  document.webkitPointerLockElement === canvas)
}

var screenMouseX = 0
var screenMouseY = 0

var worldMouseX = 0
var worldMouseY = 0

function translateMousePosition(x, y) {
  var translated = {x:x, y:y}
  translated.x = (x / cameraScale) - (halfCanvas / cameraScale)
  translated.y = (y / cameraScale) - (halfCanvas / cameraScale)
  
  translated.x += cameraX
  translated.y += cameraY
  
  return translated
}


function onMouseDown(event) {
  if(!hasPointerLock())
    canvas.requestPointerLock()
  if(orbitPlanet && selectedChat && !orbitPlanet.messageQueue) {
    selectedChat.clicked()
  }
}

function registerInputEvents() {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  document.body.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("keyup", onKeyUp);
  
  // standard requestPointerLock shim
  canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock ||
                            canvas.webkitRequestPointerLock;
}