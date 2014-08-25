planets = []
function addPlanet(x, y, name) {
  var planet = {x:x, y:y, radius: 0}
  planet.message = "Hello!"
  planet.menu = MENU_HELLO
  planet.holes = []
  if(name)
    planet.name = name
  else
    planet.name = generatePlanetName(x, y)
    
  var p = findPlanet(name);
  if(p) return p;
  
  planet.personality = {}
  planet.personality.hash = hashString(planet.name)
  planet.personality.aggression = Math.abs(planet.personality.hash) % 10
  planet.personality.wealth = Math.abs(planet.personality.hash << 2) % 10
  planet.personality.friendliness = Math.abs(planet.personality.hash << 3) % 10
  planet.personality.flavor_angle = Math.abs(planet.personality.hash) % (Math.PI * 2)
  if(Math.abs(planet.personality.flavor_angle - Math.PI / 2 + Math.PI / 4) < 0.2)
    planet.personality.flavor_angle += Math.PI / 4
  
  planet.radius = MINIMUM_PLANET_RADIUS + (Math.abs(planet.personality.hash) % (MAXIMUM_PLANET_RADIUS - MINIMUM_PLANET_RADIUS))
  planet.color = generateRandomColor(20, 20, 20, planet.personality.hash)
  planet.resource = getPlanetResource(planet)
  planet.want = getPlanetDesiredResource(planet)
  var generosity = (planet.personality.friendliness + planet.personality.wealth) - 10;
  var theirValue = (planet.want.value + generosity) * (planet.radius * planet.want.massBias);
  var myValue = (planet.resource.value * planet.resource.massBias * planet.radius);
  planet.tradeRatio = myValue / theirValue
  planet.tradeRatio = planet.tradeRatio.clamp(0.33, 3)
  if(planet.tradeRatio < 1)
  {
    planet.tradeOffer = 2
    planet.tradeDemand = Math.round(planet.tradeOffer / planet.tradeRatio)
    if(planet.tradeDemand > 3) {
      planet.tradeOffer = 1
      planet.tradeDemand = Math.round(planet.tradeOffer / planet.tradeRatio)    
    }
  }
  else {
    planet.tradeDemand = 2
    planet.tradeOffer = Math.round(planet.tradeDemand * planet.tradeRatio)
    if(planet.tradeOffer > 3) {
      planet.tradeDemand = 1
      planet.tradeOffer = Math.round(planet.tradeDemand * planet.tradeRatio)
    }
  }
  planet.gossipCount = 0;
  
  planet.type = selectBySeed(planetTypes, planet.personality.hash)
  
  if(planet.personality.friendliness > 7 || planet.personality.aggression > 7 || planet.personality.wealth > 7) {
    var npc = buildNPC(planet.x - planet.personality.friendliness, planet.y)
    npc.goal = planet;
  }
  
  planets.push(planet)
  var d = document.getElementById("planetnames");
  var option = document.createElement("option");
  option.value = planet.name;
  d.appendChild(option)
  return planet
}
// fuck it
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function findPlanet(name) {
  for(var i = 0; i < planets.length; i++) {
    if(planets[i].name == name)
      return planets[i];
  }
}
function searchForPlanet() {
  var targetName = document.getElementById("searchName").value;
  var p = findPlanet(targetName);
  if(p) {
    waypointTarget = p;
    document.getElementById("targetPlanet").innerHTML = p.name;
  }
  document.getElementById("planetSearch").style.display = "none";
  return false;
}
function clearWaypoint() {
  waypointTarget = null;
  document.getElementById("planetSearch").style.display = "none";
  document.getElementById("targetPlanet").innerHTML = ""
}

function generatePlanetName(x, y) {
  var titles = ["Empire", "Republic", "Land", "World", "Hub"]
  var adjectives = ["Alpha", "Beta", "Gamma", "Omega", "Prime", "Ver", "Dar", "New", "Great", "Greater", "Old", "Lesser", "Small", "Holy", "Dwarf"]
  var prefixes = ["Andro", "Ev", "Raz", "Zyr", "Ho", "Ad", "Ab", "Ala", "Ari", "Lat", "Kal", "Heg", "Syn", "Gar", "Arra", "Robo", "Siri", "Plut", "Satu", "Neptu", "Mercu", "Jupi", "Terr", "Termi", "Trant", "Cala", "Tato", "Sar", "Hac", "Sah", "Rev", "Vor", "As", "Ath", "Demi", "Bel", "Hal", "Jen"]
  var suffixes = ["meda", "zle", "yar", "yos", "dos", "ora", "zon", "mak", "ona", "ia", "arr", "ganda", "world", "dan", "van", "us", "y", "u", "o", "e", "a", "i", "ar", "rn", "ne", "oine", "ine", "ry", "iter", "nus", "fia", "or", "land", "gar", "alus", "lon", "th"]
  
  var seed;
  if(playerHome)
    seed = playerHome.personality.hash;
  else
    seed = Math.random() * 10000;
  var startingSeed = seed;
  
  if(x) {
    seed += x * y;
  }
  
  var name = ""
  var title_rand = generator(seed) * 10
  seed *= generator(seed) * 2;
  if(isNaN(seed))
    seed = startingSeed;
  var adj_rand = generator(seed) * 10
  seed *= generator(seed) * 2;
  if(isNaN(seed))
    seed = startingSeed;
  
  if(title_rand > 8)
    name += "The " + selectBySeed(titles, seed) + " of "
  seed *= generator(seed) * 2
  if(isNaN(seed))
    seed = startingSeed;
  if(adj_rand > 9)
    name += selectBySeed(adjectives, seed) + " "
  seed *= generator(seed) * 2
  if(isNaN(seed))
    seed = startingSeed;
  if(adj_rand > 8)
    name += selectBySeed(adjectives, seed) + " "
  seed *= generator(seed) * 2
  if(isNaN(seed))
    seed = startingSeed;
  name += selectBySeed(prefixes, seed)
  seed *= generator(seed) * 2
  if(isNaN(seed))
    seed = startingSeed;
  name += selectBySeed(suffixes, seed)
  
  return name
}
function selectA(array) {
  return array[Math.floor(array.length * Math.random())]
}
function hashString(string) {
  var hash = 0;
  for(var i = 0; i < string.length; i++) {
    c = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + c
  }
  return hash
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
    var p = addPlanet(cell.x + generator(playerHome.personality.hash + cell.x * cell.y) * GRID_CELL_SIZE,
                      cell.y + generator(playerHome.personality.hash + generator(cell.x * cell.y) * GRID_CELL_SIZE) * GRID_CELL_SIZE)
    checkPlanetForCollision(p)
    cell.planets.push(p)
  }
}
// random-seeming number generator
function generator(seed) {
  var base = Math.sin(seed) * 1000;
  return base - Math.floor(base);
}