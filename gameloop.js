var CAMERA_SPEED = 1
var camMoveVector = {x: 0, y: 0}
function update() {
  updatePlayer()
  
  cameraX = playerX
  cameraY = playerY
}