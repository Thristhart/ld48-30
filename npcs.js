function buildNPC(x, y) {
  var npc = {x:x, y:y}
  npc.width = 10
  npc.height = 20
  npc.angle = 0
  npc.velocityX = 0
  npc.velocityY = 0
  npc.accel = 0.02
  npc.thrust = 0
  npc.color = generateRandomColor(100, 100, 100)
  npc.grid = positionToGridCell(x, y)
  
  npc.goal = npc.grid.planets[Math.floor(Math.random() * npc.grid.planets.length)]
  npc.grid.npcs.push(npc)
  
}
function updateNPC(npc) {
  if(npc.orbitPlanet) {
    npc.velocityX = 0
    npc.velocityY = 0
    npc.thrust = 0
    var dx = npc.x - npc.orbitPlanet.x;
    var dy = npc.y - npc.orbitPlanet.y;
    var currentDistance = Math.sqrt(dx * dx + dy * dy);
    var orbitDistance = npc.orbitPlanet.radius + npc.height * 1.2
    if(!npc.orbitAngle) {
      npc.orbitAngle = Math.atan2(dy, dx);
    }
    var diff = orbitDistance - currentDistance;
    diff /= orbitGraduator
    npc.orbitAngle += playerOrbitSpeed * npc.orbitDirection;
    var targetPlayerAngle = npc.orbitAngle + (Math.PI / 2) * npc.orbitDirection
    var pAngleDiff = targetPlayerAngle - npc.angle;
    pAngleDiff %= Math.PI
    if(pAngleDiff > Math.PI)
      pAngleDiff -= Math.PI * 2
    if(pAngleDiff < -Math.PI)
      pAngleDiff += Math.PI * 2
      
    pAngleDiff /= orbitGraduator
    if(Math.abs(pAngleDiff) > 0.01)
      npc.angle += pAngleDiff
    else
      npc.angle = targetPlayerAngle
    
    npc.x = npc.orbitPlanet.x + Math.cos(npc.orbitAngle) * (currentDistance + diff);
    npc.y = npc.orbitPlanet.y + Math.sin(npc.orbitAngle) * (currentDistance + diff);
  }
  else {
    if(npc.goal) {
      var angleToGoal = Math.atan2(npc.goal.y - npc.y, npc.goal.x - npc.x)
      if(angleToGoal < npc.angle)
        npc.angle -= 0.05
      else
        npc.angle += 0.05
      npc.thrust = 1
    }
    npc.velocityX += Math.cos(npc.angle) * npc.thrust * npc.accel
    npc.velocityY += Math.sin(npc.angle) * npc.thrust * npc.accel
    if(npc.velocityX > VELOCITY_CAP)
      npc.velocityX = VELOCITY_CAP
    if(npc.velocityX < -VELOCITY_CAP)
      npc.velocityX = -VELOCITY_CAP
    if(npc.velocityY > VELOCITY_CAP)
      npc.velocityY = VELOCITY_CAP
    if(npc.velocityY < -VELOCITY_CAP)
      npc.velocityY = -VELOCITY_CAP
    npc.x += npc.velocityX
    npc.y += npc.velocityY
  }
  var newGrid = positionToGridCell(npc.x, npc.y)
  if(npc.grid != newGrid) {
    npc.grid.npcs.slice(npc.grid.npcs.indexOf(npc), 1)
    newGrid.npcs.push(npc)
    npc.grid = newGrid
    console.log(npc.grid.npcs)
  }
  while(npc.angle > Math.PI * 2)
    npc.angle -= Math.PI * 2
  while(npc.angle < -Math.PI * 2)
    npc.angle += Math.PI * 2
  while(npc.orbitAngle > Math.PI * 2)
    npc.orbitAngle -= Math.PI * 2
  while(npc.orbitAngle < -Math.PI * 2)
    npc.orbitAngle += Math.PI * 2
}