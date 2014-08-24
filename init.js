function onLoad(event) {
  canvas = document.getElementById("display")
  context = canvas.getContext("2d")
  minimapCanvas = document.getElementById("minimap");
  minimapContext = minimapCanvas.getContext("2d");
  
  registerInputEvents()
  
  document.getElementById("planetName").value = generatePlanetName()
  background = document.getElementById("bg");
  
  cameraScale = 0.2
}
function buildStartingPlanet() {
  var name = document.getElementById("planetName").value
  playerHome = addPlanet(0, 0, name);
  positionToGridCell(0, 0).planets.push(playerHome);
  
  orbitPlanet = playerHome
  
  playerX = playerHome.x
  playerY = playerHome.y
  cameraX = playerHome.x
  cameraY = playerHome.y
  
  playerHome.menu = MENU_HOME
  quest = generateQuest(playerHome);
  for(var i = 0; i < quest.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = quest[i].name;
    li.className = "item_" + quest[i].name;
    document.getElementById("quest").appendChild(li);
  }
  
  document.getElementById("startingPlanet").style.visibility = "hidden"
  
  window.requestAnimationFrame(render);
  canvas.requestPointerLock();
  return false;
}
window.addEventListener("load", onLoad)