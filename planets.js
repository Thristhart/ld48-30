planets = []
function addPlanet(x, y, size) {
  var planet = {x:x, y:y, radius: size}
  planet.color = generateRandomColor(20, 20, 20)
  planet.message = "Hello!"
  planet.resource = getPlanetResource(planet)
  planet.want = resources.gems
  planet.menu = MENU_HELLO
  planet.name = generatePlanetName()
  planets.push(planet)
  return planet
}

function generatePlanetName() {
  var titles = ["Empire", "Republic", "Land", "World", "Hub", "Planet"]
  var adjectives = ["Alpha", "Beta", "Gamma", "Omega", "New", "Great", "Greater", "Old", "Lesser", "Small", "Holy", "Dwarf"]
  var prefixes = ["Andro", "Heg", "Syn", "Gar", "Arra", "Robo", "Siri", "Plut", "Satu", "Neptu", "Mercu", "Jupi", "Terr", "Termi", "Trant", "Cala", "Tatoo"]
  var suffixes = ["meda", "yar", "arr", "ganda", "world", "dan", "van", "us", "o", "e", "a", "i", "rn", "ne", "ine", "ry", "iter", "nus", "fia", "or"]
  
  var name = ""
  var title_rand = Math.random() * 10
  var adj_rand = Math.random() * 10
  
  if(title_rand > 8)
    name += "The " + selectA(titles) + " of "
  if(adj_rand > 9)
    name += selectA(adjectives) + " "
  if(adj_rand > 8)
    name += selectA(adjectives) + " "
  name += selectA(prefixes)
  name += selectA(suffixes)
  
  return name
}
function selectA(array) {
  return array[Math.floor(array.length * Math.random())]
}

var MINIMUM_SPACE_BETWEEN_PLANETS = 100
var MINIMUM_PLANET_RADIUS = 70
var MAXIMUM_PLANET_RADIUS = 130
function checkPlanetForCollision(planet) {
  var planetGrid = positionToGridCell(planet.x, planet.y)
  var planetNeighbors = gridNeighbors(planetGrid)
  var local_planets = []
  for(var i = 0; i < planetNeighbors.length; i++) {
    local_planets = local_planets.concat(planetNeighbors[i].planets)
  }
  local_planets = local_planets.concat(planetGrid.planets)
  var loopCount = 0
  for(i = 0; i < local_planets.length; i++) {
    loopCount++
    var other = local_planets[i]
    if(other == planet) continue;
    var dx = planet.x - other.x
    var dy = planet.y - other.y
    var dxsquared = dx * dx
    var dysquared = dy * dy
    var collide_radius = planet.radius + other.radius + MINIMUM_SPACE_BETWEEN_PLANETS
    if(dxsquared + dysquared < collide_radius * collide_radius) {
      // we have collision
      var collisionAngle = Math.atan2(-dy, -dx)
      collisionAngle += Math.random() * Math.PI // try to break loops
      removePlanet(planet);
      planet.x += Math.cos(collisionAngle) * (other.radius + MINIMUM_SPACE_BETWEEN_PLANETS) * 1.2
      planet.y += Math.sin(collisionAngle) * (other.radius + MINIMUM_SPACE_BETWEEN_PLANETS) * 1.2
      var newGrid = positionToGridCell(planet.x, planet.y);
      newGrid.planets.push(planet)
      planets.push(planet)
      if(loopCount < 100) // failsafe
        // go back to the top of the list to make sure we didn't move into someone else
        i = 0; 
      else  
        removePlanet(planet) // fuck it, die
    }
  }
}

function removePlanet(planet) {
  planetGrid = positionToGridCell(planet.x, planet.y)
  planetGrid.planets.splice(planetGrid.planets.indexOf(planet), 1)
  planets.splice(planets.indexOf(planet), 1)
}

function generatePlanetsAroundPoint(x, y) {
  var cell = positionToGridCell(x, y)
  var neighbors = gridNeighbors(cell)
  for(var i = 0; i < neighbors.length; i++) {
    generatePlanetsInCell(neighbors[i]);
  }
  generatePlanetsInCell(cell)
}

function generatePlanetsInCell(cell) {
  if(cell.planets.length > 0) // we already built planets here
  {
    return
  }
  var planetCount = Math.ceil(Math.random() * GRID_CELL_MAX_PLANETS)
  for(var i = 0; i < planetCount; i++) {
    var p = addPlanet(cell.x + Math.random() * GRID_CELL_SIZE,
                      cell.y + Math.random() * GRID_CELL_SIZE,
                      MINIMUM_PLANET_RADIUS + Math.random() * MAXIMUM_PLANET_RADIUS);
    checkPlanetForCollision(p)
    cell.planets.push(p)
  }
}