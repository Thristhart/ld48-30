var canvas;
var context;
var cameraX = 256
var cameraY = 256
var cameraScale = 1
var additionalX = 0
var halfCanvas = 256

var lastFrameTime = new Date().getTime()
function render() {
  update()
  clear()
  
  // save at default position/scaling
  context.save()

  context.translate(halfCanvas - cameraX * cameraScale,
                    halfCanvas - cameraY * cameraScale)
  context.scale(cameraScale, cameraScale);
  
  // draw stuff
  for(var i = 0; i < planets.length; i++) {
    drawPlanet(planets[i]);
  }
  if(drawCursor)
    drawAimingCursor();
  drawPlayer();
  
  // reset translations and scaling
  context.restore()
  
  var nowTime = new Date().getTime()
  var fps = 1000/(nowTime - lastFrameTime);
  fps = Math.floor(fps)
  context.fillStyle = "white";
  context.fillText(fps, halfCanvas * 2 - 20, 20);
  lastFrameTime = new Date().getTime();
  window.requestAnimationFrame(render);
}

function drawAimingCursor() {
  
  var cursor_width = 0.5
  var cursor_radius = 0.7
  var pointer_radius = 0.9
  var targetPointX = playerX + Math.cos(cursorAngle) * (playerHeight * pointer_radius)
  var targetPointY = playerY + Math.sin(cursorAngle) * (playerHeight * pointer_radius)
  
  var leftCornerX = playerX + Math.cos(cursorAngle - cursor_width) * playerHeight * cursor_radius
  var leftCornerY = playerY + Math.sin(cursorAngle - cursor_width) * playerHeight * cursor_radius
  var rightCornerX = playerX + Math.cos(cursorAngle + cursor_width) * playerHeight * cursor_radius
  var rightCornerY = playerY + Math.sin(cursorAngle + cursor_width) * playerHeight * cursor_radius
  context.beginPath()
  context.moveTo(leftCornerX, leftCornerY)
  context.arc(playerX, playerY, playerHeight * cursor_radius, cursorAngle + cursor_width, cursorAngle - cursor_width, false)
  context.lineTo(targetPointX, targetPointY)
  context.lineTo(rightCornerX, rightCornerY)
  context.moveTo(playerX, playerY)
  context.closePath()
  context.fillStyle = "#cbfffd"
  context.fill()
}
function drawPlayer() {
  var topLeft = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 0, 0)
  var topRight = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 1, 0)
  var botLeft = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 0, 1)
  var botRight = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 1, 1)
  
  // draw rectangular shape
  context.beginPath()
  context.moveTo(topLeft.x, topLeft.y)
  context.lineTo(topRight.x, topRight.y)
  context.lineTo(botRight.x, botRight.y)
  context.lineTo(botLeft.x, botLeft.y)
  context.closePath()
  context.fillStyle = "#8f5715"
  context.fill()
  
  if(playerThrust) {
    context.beginPath()
    context.moveTo(botLeft.x, botLeft.y)
    context.lineTo(playerX - Math.cos(playerAngle) * 20, playerY - Math.sin(playerAngle) * 20)
    context.lineTo(topLeft.x, topLeft.y)
    context.closePath()
    context.fillStyle = "red"
    context.fill()
    context.stroke()
  }
}

function pointInRect(rx, ry, angle, width, height, p_x, p_y) {
  var centerX = width / 2
  var centerY = height / 2
  
  p_x *= width
  p_y *= height
  
  var dx = p_x - centerX
  var dy = p_y - centerY
  
  var relative_angle = Math.atan2(dy, dx)
  var distance = Math.sqrt(dx * dx + dy * dy)
  
  var final_angle = relative_angle + angle
  
  var point = {}
  point.x = rx + Math.cos(final_angle) * distance
  point.y = ry + Math.sin(final_angle) * distance
  return point
}

function drawPlanet(planet) {
  context.fillStyle = planet.color
  context.moveTo(planet.x, planet.y)
  context.beginPath()
  context.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2, true);
  context.closePath()
  context.fill()
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}


function generateRandomColor(mix_r, mix_g, mix_b) {
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);
  if(mix_r && mix_g && mix_b) {
    red = Math.floor((red + mix_r) / 2);
    green = Math.floor((green + mix_g) / 2);
    blue = Math.floor((blue + mix_b) / 2);
  }
  
  
  return "rgb(" + red + "," + green + "," + blue + ")";
}