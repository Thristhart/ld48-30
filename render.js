var canvas;
var context;
var cameraX = 256
var cameraY = 256
var cameraScale = 1
var additionalX = 0
var halfCanvas = 256
var pauseRender = false

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
  var playerCell = positionToGridCell(playerX, playerY);
  var neighbors = gridNeighbors(playerCell)
  drawGrid(playerCell);
  for(var i = 0; i < neighbors.length; i++) {
    drawGrid(neighbors[i]);
  }
  if(orbitPlanet) {
    drawDialog(orbitPlanet.message, 
              orbitPlanet.x + orbitPlanet.radius/2, 
              orbitPlanet.y - orbitPlanet.radius/2,
              {font: "Segoe UI",
               width: orbitPlanet.radius/3,
               height: orbitPlanet.radius/4,})
  }
  if(drawCursor)
    drawAimingCursor();
  drawPlayer();
  drawChatWheel()
  // reset translations and scaling
  context.restore()
  
  var nowTime = new Date().getTime()
  var fps = 1000/(nowTime - lastFrameTime);
  fps = Math.floor(fps)
  context.fillStyle = "white";
  context.fillText(fps, halfCanvas * 2 - 20, 20);
  lastFrameTime = new Date().getTime();
  if(pauseRender)
    return
  else
    window.requestAnimationFrame(render);
}

function drawGrid(cell) {
  for(var i = 0; i < cell.planets.length; i++) {
    drawPlanet(cell.planets[i])
  }
  for(var i = 0; i < cell.npcs.length; i++) {
    drawNPC(cell.npcs[i])
  }
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
  context.fillStyle = "#8f5715";
  context.strokeStyle = "#8f5715";
  context.beginPath()
  context.moveTo(topLeft.x, topLeft.y)
  context.lineTo(topRight.x, topRight.y)
  context.lineTo(botRight.x, botRight.y)
  context.lineTo(botLeft.x, botLeft.y)
  context.closePath()
  context.stroke()
  context.fill()
  
  if(playerThrust) {
    context.beginPath()
    context.moveTo(botLeft.x, botLeft.y)
    context.lineTo(playerX - Math.cos(playerAngle) * 20, playerY - Math.sin(playerAngle) * 20)
    context.lineTo(topLeft.x, topLeft.y)
    context.closePath()
    context.fillStyle = "red"
    context.fill()
  }
}
function drawNPC(npc) {
  var topLeft = pointInRect(npc.x, npc.y, npc.angle, npc.height, npc.width, 0, 0)
  var topRight = pointInRect(npc.x, npc.y, npc.angle, npc.height, npc.width, 1, 0)
  var botLeft = pointInRect(npc.x, npc.y, npc.angle, npc.height, npc.width, 0, 1)
  var botRight = pointInRect(npc.x, npc.y, npc.angle, npc.height, npc.width, 1, 1)
  
  // draw rectangular shape
  context.fillStyle = npc.color;
  context.strokeStyle = npc.color;
  context.beginPath()
  context.moveTo(topLeft.x, topLeft.y)
  context.lineTo(topRight.x, topRight.y)
  context.lineTo(botRight.x, botRight.y)
  context.lineTo(botLeft.x, botLeft.y)
  context.closePath()
  context.stroke()
  context.fill()
  
  if(npc.thrust) {
    context.beginPath()
    context.moveTo(botLeft.x, botLeft.y)
    context.lineTo(npc.x - Math.cos(npc.angle) * 20, npc.y - Math.sin(npc.angle) * 20)
    context.lineTo(topLeft.x, topLeft.y)
    context.closePath()
    context.fillStyle = "red"
    context.fill()
  }
}
var testFont = null
function drawDialog(text, tailX, tailY, style) {
  var textOffsetX = 0
  var textOffsetY = 0
  var width = 50
  var height = 40
  if(style) {
    textOffsetX = style.xOffset
    textOffsetY = style.yOffset
    if(style.width) width = style.width;
    if(style.height) height = style.height;
    context.font = width / 3 + "px " + style.font
  }
  var lines = text.split("\n")
  var textWidth = 0
  for(var i = 0; i < lines.length; i++) {
    w = context.measureText(lines[i]).width
    if(w > textWidth)
      textWidth = w
  }
  width = textWidth / 1.5
  if(height < 20) height = 20
  if(width < 40) width = 40
  var x = tailX + width
  var y = tailY - height
  context.beginPath();
  context.moveTo(x,y - height);
  context.quadraticCurveTo(x - width, y - height,
                           x - width, y - 2.5);
  context.quadraticCurveTo(x - width, y + height/2,
                           x - width/2, y + height/2);
  context.quadraticCurveTo(x - width/2, y + height - 5,
                           x - width - 5, y + height);
  context.quadraticCurveTo(x - width/3, y + height - 5,
                           x - width/5, y + height/2);
  context.quadraticCurveTo(x + width, y + height/2,
                           x + width, y - height/4);
  context.quadraticCurveTo(x + width, y - height,
                           x     , y - height);
  context.fillStyle = "white";
  context.fill();
  context.fillStyle = "black";
  for(var i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x - textWidth / 2, (y - (lines.length * 15/2)) + i * 15);  
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
  context.fillStyle = "white";
  context.font = 20 / cameraScale + "pt Arial"
  var width = context.measureText(planet.name).width
  context.fillText(planet.name, planet.x - width / 2, planet.y);  
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