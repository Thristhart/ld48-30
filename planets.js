planets = []
function addPlanet(x, y, size) {
  var planet = {x:x, y:y, radius: size}
  planet.color = generateRandomColor(20, 20, 20)
  planets.push(planet)
}