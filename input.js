var cursorAngle = 0
var MOUSE_DISTANCE_CAP = 100
var waypointTarget = null;
function onMouseMove(event) {
  if(hasPointerLock()) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
    screenMouseX += movementX * CAMERA_SPEED
    screenMouseY += movementY * CAMERA_SPEED
  }
  else
  {
    // standard shim to make offsetX/Y work crossbrowser
    var target = event.target || event.srcElement,
          rect = target.getBoundingClientRect();
    
    screenMouseX = event.clientX - rect.left - halfCanvas,
    screenMouseY = event.clientY - rect.top - halfCanvas
  }
  screenMouseDistance = Math.sqrt(screenMouseX * screenMouseX + screenMouseY * screenMouseY)
  if(screenMouseDistance > MOUSE_DISTANCE_CAP) {
    screenMouseX = screenMouseX / screenMouseDistance * MOUSE_DISTANCE_CAP;
    screenMouseY = screenMouseY / screenMouseDistance * MOUSE_DISTANCE_CAP;
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
    case 90:
      if(playerWeapon)
        drawCursor = true;
      break;
    case 70: // F
      if(document.getElementById("planetSearch").style.display == "none") {
        document.getElementById("planetSearch").style.display = "block";
      }
      document.exitPointerLock();
      event.stopPropagation();
      event.cancelBubble = false;
      document.getElementById("searchName").focus();
      justOpenedForm = true;
      break;
  }
  return false;
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
    case 90:
      drawCursor = false;
      event.stopPropagation();
      event.cancelBubble = false;
      break;
  }
  return false;
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
  if(!hasPointerLock() && playerHome)
    return canvas.requestPointerLock();
  if(drawCursor) {
    fireWeapon();
  }
  else if(orbitPlanet && selectedChat && !pauseRender && !orbitPlanet.messageQueue && !orbitPlanet.dead && !orbitPlanet.beenThreatened) {
    selectedChat.clicked()
  }
}

var justOpenedForm = false;
function onInputChange(event) {
  if(justOpenedForm) {
    event.target.value = event.target.value.substr(0, event.target.value.length - 1);
    justOpenedForm = false;
  }
}

function registerInputEvents() {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  document.body.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("keyup", onKeyUp);
  
  document.getElementById("searchName").addEventListener("input", onInputChange);
  
  // standard requestPointerLock shim
  canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock ||
                            canvas.webkitRequestPointerLock;
  document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;
}