var CAMERA_SPEED = 3.2
var CAMERA_SCALE_SPEED = 0.007
var camMoveVector = {x: 0, y: 0}
var cameraReturning = false
function update() {
  updatePlayer()
  
  if(cameraTarget) {
    var width = cameraTarget.radius || cameraTarget.height / 2
    var targetScreenWidth = width * 3
    var targetScale = (2 * halfCanvas) / targetScreenWidth
    var camDiff = targetScale - cameraScale
    if(Math.abs(camDiff) < CAMERA_SCALE_SPEED)
      cameraScale = targetScale;
    else {
      if(camDiff > 0)
        cameraScale += CAMERA_SCALE_SPEED
      if(camDiff < 0)
        cameraScale -= CAMERA_SCALE_SPEED
    }
    var cDx = cameraTarget.x - cameraX
    var cDy = cameraTarget.y - cameraY
    var cAngle = Math.atan2(cDy, cDx)
    if(Math.abs(cDx) > CAMERA_SPEED || Math.abs(cDy) > CAMERA_SPEED) {
      cameraX += Math.cos(cAngle) * CAMERA_SPEED
      cameraY += Math.sin(cAngle) * CAMERA_SPEED
    }
  }
  else {
    if(cameraReturning) {
      var doneScale = false
      var doneMove = false
      var targetScale = 1
      var camDiff = targetScale - cameraScale
      if(Math.abs(camDiff) < CAMERA_SCALE_SPEED) {
        cameraScale = targetScale;
        doneScale = true
      }
      else {
        if(camDiff > 0)
          cameraScale += CAMERA_SCALE_SPEED
        if(camDiff < 0)
          cameraScale -= CAMERA_SCALE_SPEED
      }
      var cDx = playerX - cameraX
      var cDy = playerY - cameraY
      var cAngle = Math.atan2(cDy, cDx)
      if(Math.abs(cDx) > CAMERA_SPEED*1.5 || Math.abs(cDy) > CAMERA_SPEED*1.5) {
        cameraX += Math.cos(cAngle) * CAMERA_SPEED * 1.5
        cameraY += Math.sin(cAngle) * CAMERA_SPEED * 1.5
      }
      else {
        cameraX = playerX
        cameraY = playerY
        doneMove = true
      }
      if(doneScale && doneMove)
        cameraReturning = false
    }
    else {
      cameraX = playerX
      cameraY = playerY
    }
  }
  generatePlanetsAroundPoint(playerX, playerY);
  
  var playerCell = positionToGridCell(playerX, playerY);
  var neighbors = gridNeighbors(playerCell)
  playerColliding = false
  updateGrid(playerCell);
  for(var i = 0; i < neighbors.length; i++) {
    updateGrid(neighbors[i]);
  }
  document.getElementById("x").innerHTML = Math.floor(playerX)
  document.getElementById("y").innerHTML = Math.floor(playerY)
}

function updateGrid(cell) {
  checkForCollisions(cell)
  for(var i = 0; i < cell.npcs.length; i++) {
    updateNPC(cell.npcs[i])
  }
}
function checkForCollisions(cell) {
  for(var i = 0; i < cell.planets.length; i++) {
    checkPlayerCollision(cell.planets[i]);
    for(var j = 0; j < cell.npcs.length; j++) {
      checkNPCCollision(cell.planets[i], cell.npcs[j]);
    }
  }
}

function checkNPCCollision(planet, npc) {
  var dx = planet.x - npc.x
  var dy = planet.y - npc.y
  var dxsquared = dx * dx
  var dysquared = dy * dy
  var orbit_radius = planet.radius + npc.height
  if(dxsquared + dysquared < orbit_radius * orbit_radius) {
    if(!npc.orbitPlanet)
    {
      npc.orbitPlanet = planet
      var angleToPlanet = Math.atan2(dy, dx);
      if(angleToPlanet < npc.angle) npc.orbitDirection = -1;
      else npc.orbitDirection = 1;
    }
  }
}

function checkPlayerCollision(planet) {
  var dx = planet.x - playerX
  var dy = planet.y - playerY
  var dxsquared = dx * dx
  var dysquared = dy * dy
  var collide_radius = planet.radius + playerHeight/2
  var orbit_radius = planet.radius + playerHeight
  if(dxsquared + dysquared < orbit_radius * orbit_radius) {
    if(!orbitPlanet)
    {
      orbitPlanet = planet
      console.log(planet.personality)
      var angleToPlanet = Math.atan2(dy, dx);
      if(angleToPlanet < playerAngle) orbitDirection = -1;
      else orbitDirection = 1;
    }
    if(dxsquared + dysquared < collide_radius * collide_radius)
      playerColliding = true
  }
}