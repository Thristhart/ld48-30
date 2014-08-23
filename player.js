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
var playerColliding = false;
var drawCursor = false;

var VELOCITY_CAP = 5
function updatePlayer() {
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
  
  checkForCollisions()
}

function checkForCollisions() {
  playerColliding = false
  for(var i = 0; i < planets.length; i++) {
    checkPlanetCollision(planets[i])
  }
}

function checkPlanetCollision(planet) {
  var dx = planet.x - playerX
  var dy = planet.y - playerY
  var combined_radius = planet.radius + playerHeight/2
  if(dx * dx + dy * dy < combined_radius * combined_radius) {
    dampenVelocity()
    playerColliding = true
  }
}

function dampenVelocity() {
  playerVelocityX /= 2
  playerVelocityY /= 2
  if(playerVelocityX < 0.5)
    playerVelocityX = 0
  if(playerVelocityY < 0.5)
    playerVelocityY = 0
}