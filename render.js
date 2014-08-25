var canvas;
var context;
var minimapCanvas;
var minimapContext;
var cameraX = 256
var cameraY = 256
var cameraScale = 1
var additionalX = 0
var halfCanvas = 256
var pauseRender = false
var background = null

var lastFrameTime = new Date().getTime()
function render() {
  if(pauseRender) {
    window.requestAnimationFrame(render);
    return;
  }
  update()
  clear()
  
  scaleAndTransform();
  
  
  // draw stuff
  var playerCell = positionToGridCell(playerX, playerY);
  var neighbors = gridNeighbors(playerCell).concat(playerCell)
  for(var i = 0; i < neighbors.length; i++) {
    var cell = neighbors[i];
    context.drawImage(background, cell.x, cell.y, GRID_CELL_SIZE, GRID_CELL_SIZE); 
  }
  for(var i = 0; i < neighbors.length; i++) {
    drawGrid(neighbors[i]);
  }
  if(orbitPlanet && !orbitPlanet.dead) {
    drawDialog(orbitPlanet.message, 
              orbitPlanet.x - orbitPlanet.radius * 0.7,
              orbitPlanet.y + orbitPlanet.radius * 0.7,
              {font: "Segoe UI",
               width: orbitPlanet.radius/3,
               height: orbitPlanet.radius/4,})
  }
  
  if(missileOut)
    drawMissile();
  if(drawCursor)
    drawAimingCursor();
  drawPlayer();
  drawChatWheel()
  
  
  if(playerInventory.length == 0 && orbitPlanet && orbitPlanet != playerHome) {
    drawDialog("I've run out of resources! I should head home for more.", 
              playerX, playerY,{font: "Segoe UI",
               width: orbitPlanet.radius/3,
               height: orbitPlanet.radius/4});
  }
  
  // reset translations and scaling
  context.restore()
  if(waypointTarget == orbitPlanet) {
    waypointTarget = null;
    document.getElementById("targetPlanet").innerHTML = ""
  }
  if(waypointTarget) {
    var angle = Math.atan2(waypointTarget.y - cameraY,  waypointTarget.x - cameraX);
    var angleX = 64 * Math.cos(angle) + 64;
    var angleY = 64 * Math.sin(angle)+ 64;
    var leftX = 56 * Math.cos(angle - 0.3)+ 64;
    var leftY = 56 * Math.sin(angle - 0.3)+ 64;
    var rightX = 56 * Math.cos(angle + 0.3)+ 64;
    var rightY = 56 * Math.sin(angle + 0.3)+ 64;
    console.log(angle, leftX, angleX, rightX);
    minimapContext.beginPath();
    minimapContext.moveTo(leftX, leftY);
    minimapContext.lineTo(angleX, angleY);
    minimapContext.lineTo(rightX, rightY);
    minimapContext.closePath();
    minimapContext.fillStyle = "#FF4200";
    minimapContext.fill();
  }
  
  updateWeaponStatus();
  
  var nowTime = new Date().getTime()
  var fps = 1000/(nowTime - lastFrameTime);
  fps = Math.floor(fps)
  context.fillStyle = "white";
  context.fillText(fps, halfCanvas * 2 - 20, 20);
  lastFrameTime = new Date().getTime();
  window.requestAnimationFrame(render);
}

function updateWeaponStatus() {
  var status = document.getElementById("weapon_status")
  var cd = document.getElementById("cooldown")
  if(playerWeapon) {
    if(weaponCooldown) {
      cd.innerHTML = weaponCooldown;
      status.className = "panel cooldown";
    }
    else {
      cd.innerHTML = "READY";
      status.className = "panel ready";
    }
  }
  else {
    cd.innerHTML = "NONE"
    status.className = "panel none";
  }
}

function scaleAndTransform() {
  // save at default position/scaling
  context.save()

  context.translate(halfCanvas - cameraX * cameraScale,
                    halfCanvas - cameraY * cameraScale)
  context.scale(cameraScale, cameraScale);
}

function drawMissile() {
  var topLeft = pointInRect(missileX, missileY, missileAngle, 5, 3, 0, 0)
  var topRight = pointInRect(missileX, missileY, missileAngle, 5, 3, 1, 0)
  var botLeft = pointInRect(missileX, missileY, missileAngle, 5, 3, 0, 1)
  var botRight = pointInRect(missileX, missileY, missileAngle, 5, 3, 1, 1)
  
  // draw rectangular shape
  context.fillStyle = "#C7CBD1";
  context.strokeStyle = "#C7CBD1";
  context.beginPath()
  context.moveTo(topLeft.x, topLeft.y)
  context.lineTo(topRight.x, topRight.y)
  context.lineTo(botRight.x, botRight.y)
  context.lineTo(botLeft.x, botLeft.y)
  context.closePath()
  context.stroke()
  context.fill()
    
  context.beginPath()
  context.moveTo(botLeft.x, botLeft.y)
  context.lineTo(missileX - Math.cos(missileAngle) * 2, missileY - Math.sin(missileAngle) * 2)
  context.lineTo(topLeft.x, topLeft.y)
  context.closePath()
  context.fillStyle = "red"
  context.fill()
}


function updateInventory() {
  var inv_dom = document.getElementById("inventory")
  inv_dom.innerHTML = ""
  for(var i = 0; i < playerInventory.length; i++) {
    var li = document.createElement("li")
    li.innerHTML = playerInventory[i].name
    li.className = "item_" + playerInventory[i].name;
    inv_dom.appendChild(li)
  }
}

function drawGrid(cell) {
  for(var i = 0; i < cell.npcs.length; i++) {
    drawNPC(cell.npcs[i])
  }
  for(var i = 0; i < cell.planets.length; i++) {
    drawPlanet(cell.planets[i])
  }
}

function drawAimingCursor() {
  /*
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
  context.fill()*/
  var x = playerX + screenMouseX
  var y = playerY + screenMouseY
  context.strokeStyle = "#FF4200";
  context.beginPath();
  context.arc(x, y, 20, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(x, y, 15, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.moveTo(x-12, y);
  context.lineTo(x+12, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y-12);
  context.lineTo(x, y+12);
  context.stroke();
  
  c
  
}
function drawPlayer() {
  var topLeft = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 0, 0)
  var topRight = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 1, 0)
  var botLeft = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 0, 1)
  var botRight = pointInRect(playerX, playerY, playerAngle, playerHeight, playerWidth, 1, 1)
  
  // draw rectangular shape
  context.fillStyle = "#C7CBD1";
  context.strokeStyle = "#C7CBD1";
  context.beginPath()
  context.moveTo(topLeft.x, topLeft.y)
  context.lineTo(topRight.x, topRight.y)
  context.lineTo(botRight.x, botRight.y)
  context.lineTo(botLeft.x, botLeft.y)
  context.closePath()
  context.stroke()
  context.fill()
  
  
  var miniX = (playerX - cameraX)/16 + 64;
  var miniY = (playerY - cameraY)/16 + 64;
  minimapContext.strokeStyle = "#C7CBD1";
  minimapContext.lineWidth = 3;
  minimapContext.beginPath()
  minimapContext.moveTo(miniX, miniY);
  minimapContext.lineTo(miniX + Math.cos(playerAngle) * 5, miniY + Math.sin(playerAngle) * 5)
  minimapContext.closePath()
  minimapContext.stroke()
  
  
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
  var lines = wordWrap(text, style.width * 4)
  var textWidth = 0
  for(var i = 0; i < lines.length; i++) {
    w = context.measureText(lines[i]).width
    if(w > textWidth)
      textWidth = w
  }
  width = textWidth / 1.5
  height = lines.length * 12
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
    context.fillText(lines[i], x - textWidth / 2, (y - (lines.length * 10)/2) + i * 10);  
  }
}
function wordWrap(string, maxLength) {
  var lines = []
  while(string.length) {
    for(var i = string.length; context.measureText(string.substr(0, i)).width > maxLength; i--);
    
    var currentLine = string.substr(0, i);
    var spaceIndex = 0;
    if(i != string.length) {
      for(spaceIndex = 0; currentLine.indexOf(" ", spaceIndex) != -1; spaceIndex = currentLine.indexOf(" ", spaceIndex)+1);
    }
    if(spaceIndex) {
      currentLine = currentLine.substr(0, spaceIndex);
    }
    lines = lines.concat(currentLine.split("\n"))
    
    string = string.substr(currentLine.length, string.length);
  }
  return lines
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
  
  minimapContext.fillStyle = planet.color
  var miniX = (planet.x - cameraX)/16 + 64;
  var miniY = (planet.y - cameraY)/16 + 64;
  minimapContext.moveTo(miniX, miniY);
  minimapContext.beginPath()
  minimapContext.arc(miniX, miniY, planet.radius/16, 0, Math.PI * 2, true);
  minimapContext.closePath()
  minimapContext.fill()
  
  var antenna_angle = Math.PI / 2 + Math.PI / 4
  var ax = planet.x + Math.cos(antenna_angle) * planet.radius
  var ay = planet.y + Math.sin(antenna_angle) * planet.radius
  
  var topaX = ax + Math.cos(antenna_angle) * 20
  var topaY = ay + Math.sin(antenna_angle) * 20
  
  var leftCornerX = ax + Math.cos(antenna_angle + Math.PI / 2) * 5
  var leftCornerY = ay + Math.sin(antenna_angle + Math.PI / 2) * 5
  
  var rightCornerX = ax + Math.cos(antenna_angle - Math.PI / 2) * 5
  var rightCornerY = ay + Math.sin(antenna_angle - Math.PI / 2) * 5
  
  var leftCornerToTop = Math.atan2(topaY - leftCornerY, topaX - leftCornerX)
  var rightCornerToTop = Math.atan2(topaY - rightCornerY, topaX - rightCornerX)
  var bar1leftX = leftCornerX + Math.cos(leftCornerToTop) * 5
  var bar1leftY = leftCornerY + Math.sin(leftCornerToTop) * 5
  var bar1rightX = rightCornerX + Math.cos(rightCornerToTop) * 5
  var bar1rightY = rightCornerY + Math.sin(rightCornerToTop) * 5
  var bar2leftX = leftCornerX + Math.cos(leftCornerToTop) * 10
  var bar2leftY = leftCornerY + Math.sin(leftCornerToTop) * 10
  var bar2rightX = rightCornerX + Math.cos(rightCornerToTop) * 10
  var bar2rightY = rightCornerY + Math.sin(rightCornerToTop) * 10
  context.beginPath()
  context.moveTo(ax, ay)
  context.moveTo(leftCornerX, leftCornerY)
  context.lineTo(topaX, topaY)
  context.lineTo(rightCornerX, rightCornerY)
  context.moveTo(bar1leftX, bar1leftY)
  context.lineTo(bar1rightX, bar1rightY)
  context.moveTo(bar2leftX, bar2leftY)
  context.lineTo(bar2rightX, bar2rightY)
  context.closePath()
  context.strokeStyle = "white"
  context.fillStyle = "white";
  context.stroke()
  
  if(orbitPlanet == planet && !orbitPlanet.dead) {
    context.moveTo(topaX, topaY)
    var waves_angle = antenna_angle + Math.PI / 2
    context.beginPath()
    context.arc(topaX, topaY, 7, waves_angle - 1, waves_angle + 1)
    context.stroke()
    context.beginPath()
    context.arc(topaX, topaY, 12, waves_angle - 1.1, waves_angle + 1.1)
    context.stroke()
    var waves_angle = antenna_angle - Math.PI / 2
    context.beginPath()
    context.arc(topaX, topaY, 7, waves_angle - 1, waves_angle + 1)
    context.stroke()
    context.beginPath()
    context.arc(topaX, topaY, 12, waves_angle - 1.1, waves_angle + 1.1)
    context.stroke()
  }
  
  context.beginPath()
  context.moveTo(topaX, topaY)
  context.arc(topaX, topaY, 3, 0, Math.PI * 2)
  context.closePath()
  context.fill()
  
  if(planet.type == "industrial") {
    var factory_angle = planet.personality.flavor_angle
    var factory_x = planet.x + Math.cos(factory_angle) * planet.radius * 1.05
    var factory_y = planet.y + Math.sin(factory_angle) * planet.radius * 1.05
    var factory_width = planet.radius / 10
    var factory_height = planet.radius / 5
    var topLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, 0)
    var topRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 1, 0)
    var botLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, 1)
    var botRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 1, 1)
    var smokestackLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, -0.5)
    var smokestackRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.2, -0.5)
    var smokestackBotRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.2, 0)
    
    var smokeLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, -0.1, -1)
    var smokeMiddle = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.15, -0.7)
    var smokeMiddleTop = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.14, -1.3)
    var smokeRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.1, -1.5)
    var smokeMiddleTopmost = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, -0.1, -1.5)
    
    context.beginPath()
    context.moveTo(topLeft.x, topLeft.y);
    context.lineTo(topRight.x, topRight.y);
    context.lineTo(botRight.x, botRight.y);
    context.lineTo(botLeft.x, botLeft.y);
    context.closePath()
    context.fill()
    context.beginPath()
    context.moveTo(topLeft.x, topLeft.y);
    context.lineTo(smokestackLeft.x, smokestackLeft.y)
    context.lineTo(smokestackRight.x, smokestackRight.y)
    context.lineTo(smokestackBotRight.x, smokestackBotRight.y)
    context.closePath()
    context.fill()
    
    context.beginPath()
    //context.moveTo(smokeMiddle.x, smokeMiddle.y)
    context.arc(smokeMiddle.x, smokeMiddle.y, planet.radius / 40, factory_angle, factory_angle - Math.PI, true)
    //context.quadraticCurveTo(smokeLeft.x, smokeLeft.y, smokeMiddleTop.x, smokeMiddleTop.y)
    //context.quadraticCurveTo(smokeRight.x, smokeRight.y, smokeMiddleTopmost.x, smokeMiddleTopmost.y)
    context.stroke()
    context.beginPath()
    context.arc(smokeMiddleTop.x, smokeMiddleTop.y, planet.radius / 40, factory_angle, factory_angle + Math.PI, false)
    context.stroke()
  }
  if(planet.type == "labor") {
    var factory_angle = planet.personality.flavor_angle
    var factory_x = planet.x + Math.cos(factory_angle) * planet.radius * 1.1
    var factory_y = planet.y + Math.sin(factory_angle) * planet.radius * 1.1
    var factory_width = planet.radius / 5
    var factory_height = planet.radius / 8
    var topLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, 0)
    var topRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 1, 0)
    var botLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, 1)
    var botRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 1, 1)
    var smokestackLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, -0.5)
    var smokestackRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.2, -0.5)
    var smokestackBotRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.2, 0)
    
    var smokeLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, -0.1, -1)
    var smokeMiddle = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.15, -0.7)
    var smokeMiddleTop = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.14, -1.3)
    var smokeRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.1, -1.5)
    var smokeMiddleTopmost = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, -0.1, -1.5)
    
    context.beginPath()
    context.moveTo(topLeft.x, topLeft.y);
    context.lineTo(topRight.x, topRight.y);
    context.lineTo(botRight.x, botRight.y);
    context.lineTo(botLeft.x, botLeft.y);
    context.closePath()
    context.fill()
  }
  if(planet.type == "luxury") {
    var factory_angle = planet.personality.flavor_angle
    var factory_x = planet.x + Math.cos(factory_angle) * planet.radius * 1.1
    var factory_y = planet.y + Math.sin(factory_angle) * planet.radius * 1.1
    var factory_width = planet.radius / 5
    var factory_height = planet.radius / 8
    var topLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, 0)
    var topRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 1, 0)
    var botLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, 1)
    var botRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 1, 1)
    var smokestackLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0, -0.5)
    var smokestackRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.2, -0.5)
    var smokestackBotRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.2, 0)
    
    var smokeLeft = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, -0.1, -1)
    var smokeMiddle = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.15, -0.7)
    var smokeMiddleTop = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.14, -1.3)
    var smokeRight = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, 0.1, -1.5)
    var smokeMiddleTopmost = pointInRect(factory_x, factory_y, factory_angle + Math.PI / 2, factory_height, factory_width, -0.1, -1.5)
    
    context.beginPath()
    context.moveTo(planet.x + Math.cos(factory_angle) * planet.radius * 1.3, planet.y + Math.sin(factory_angle) * planet.radius * 1.3);
    context.lineTo(botRight.x, botRight.y);
    context.lineTo(botLeft.x, botLeft.y);
    context.closePath()
    context.fill()
  }
  
  if(!planet.dead) {
    context.font = 20 / cameraScale + "pt Arial"
    var width = context.measureText(planet.name).width
    context.fillText(planet.name, planet.x - width / 2, planet.y);  
  }
  drawPlanetHoles(planet);
}
function drawPlanetHoles(planet) {
  context.restore();
  for(var i = 0; i < planet.holes.length; i++) {
    scaleAndTransform();
    var h = planet.holes[i];
    context.beginPath();
    context.moveTo(h.x, h.y);
    context.arc(h.x, h.y, h.radius, 0, Math.PI*2);
    context.clip();
    
    var pCell = positionToGridCell(playerX, playerY);
    var neighbors = gridNeighbors(pCell).concat(pCell)
    for(var j = 0; j < neighbors.length; j++) {
      var cell = neighbors[j];
      context.drawImage(background, cell.x, cell.y, GRID_CELL_SIZE, GRID_CELL_SIZE); 
    }
    
    // todo: make hole in minimap?
    context.restore();
  }
  scaleAndTransform();
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height)
}

// not actually a seed but don't tell anyone and I won't
function generateRandomColor(mix_r, mix_g, mix_b, seed) {
  if(!seed) {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
  }
  else {
    var red = Math.floor(Math.abs(seed) % 256);
    var green = Math.floor(Math.abs(seed << 2) % 256);
    var blue = Math.floor(Math.abs(seed << 3) % 256);
  }
  if(mix_r && mix_g && mix_b) {
    red = Math.floor((red + mix_r) / 2);
    green = Math.floor((green + mix_g) / 2);
    blue = Math.floor((blue + mix_b) / 2);
  }
  
  
  return "rgb(" + red + "," + green + "," + blue + ")";
}