var playerX = 0;
var playerY = 0;
var playerAngle = 0;
var playerWidth = 10;
var playerHeight = 20;
var playerVelocityX = 0;
var playerVelocityY = 0;
var playerThrust = 0;
var playerTurnThrust = 0;
var playerTurnrate = 0.05;
var playerAccel = 0.05;
var playerOrbitSpeed = 0.003;
var playerColliding = false;
var drawCursor = false;
var orbitPlanet = null;
var orbitAngle = null;
var orbitGraduator = 30;
var orbitDirection = 1;
var playerInventory = []

var VELOCITY_CAP = 5
function updatePlayer() {
  if(orbitPlanet && !playerThrust) {
    cameraTarget = orbitPlanet
    playerVelocityX = 0
    playerVelocityY = 0
    var dx = playerX - orbitPlanet.x;
    var dy = playerY - orbitPlanet.y;
    var currentDistance = Math.sqrt(dx * dx + dy * dy);
    var orbitDistance = orbitPlanet.radius + playerHeight * 1.2
    if(!orbitAngle) {
      orbitAngle = Math.atan2(dy, dx);
    }
    var diff = orbitDistance - currentDistance;
    diff /= orbitGraduator
    orbitAngle += playerOrbitSpeed * orbitDirection;
    var targetPlayerAngle = orbitAngle + (Math.PI / 2) * orbitDirection
    var pAngleDiff = targetPlayerAngle - playerAngle;
    pAngleDiff %= Math.PI
    if(pAngleDiff > Math.PI)
      pAngleDiff -= Math.PI * 2
    if(pAngleDiff < -Math.PI)
      pAngleDiff += Math.PI * 2
      
    pAngleDiff /= orbitGraduator
    if(Math.abs(pAngleDiff) > 0.01)
      playerAngle += pAngleDiff
    else
      playerAngle = targetPlayerAngle
    
    playerX = orbitPlanet.x + Math.cos(orbitAngle) * (currentDistance + diff);
    playerY = orbitPlanet.y + Math.sin(orbitAngle) * (currentDistance + diff);
  }
  else {
    if(orbitPlanet)
      cameraReturning = true
    orbitPlanet = null
    orbitAngle = null
    cameraTarget = null
    playerAngle += playerTurnrate * playerTurnThrust
    playerVelocityX += Math.cos(playerAngle) * playerThrust * playerAccel
    playerVelocityY += Math.sin(playerAngle) * playerThrust * playerAccel
    
    
    
    if(playerVelocityX > VELOCITY_CAP)
      playerVelocityX = VELOCITY_CAP
    if(playerVelocityX < -VELOCITY_CAP)
      playerVelocityX = -VELOCITY_CAP
    if(playerVelocityY > VELOCITY_CAP)
      playerVelocityY = VELOCITY_CAP
    if(playerVelocityY < -VELOCITY_CAP)
      playerVelocityY = -VELOCITY_CAP
    
    if(!playerColliding) {
      playerX += playerVelocityX
      playerY += playerVelocityY
    }
  }
  while(playerAngle > Math.PI * 2)
    playerAngle -= Math.PI * 2
  while(playerAngle < -Math.PI * 2)
    playerAngle += Math.PI * 2
  while(orbitAngle > Math.PI * 2)
    orbitAngle -= Math.PI * 2
  while(orbitAngle < -Math.PI * 2)
    orbitAngle += Math.PI * 2
}

function playerHasResource(res) {
  for(var i = 0; i < playerInventory.length; i++) {
    if(playerInventory[i] == res)
      return true
  }
  return false
}
