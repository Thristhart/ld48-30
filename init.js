function onLoad(event) {
  canvas = document.getElementById("display")
  context = canvas.getContext("2d")
  minimapCanvas = document.getElementById("minimap");
  minimapContext = minimapCanvas.getContext("2d");
  
  registerInputEvents()
  
  generatePlanetsAroundPoint(playerX, playerY)
  playerHome = orbitPlanet = planets[0]
  playerX = playerHome.x
  playerY = playerHome.y
  cameraX = playerHome.x
  cameraY = playerHome.y
  playerHome.menu = MENU_HOME
  playerInventory.push(playerHome.resource)
  cameraScale = 0.2
  window.requestAnimationFrame(render)
}
window.addEventListener("load", onLoad)