var resources = {}

var planetTypes = ["industrial", "luxury", "labor"]
resources.metal = {
  massBias: 1,
  type: "industrial",
  value: 2,
  name: "Metal"
}
resources.weapons = {
  massBias: 1,
  type: "industrial",
  value: 5,
  name: "Weapons"
}
resources.gems = {
  massBias: 2,
  type: "luxury",
  value: 5,
  name: "Gems"
}
resources.food = {
  massBias: 3,
  type: "labor",
  value: 3,
  name: "Food"
}
resources.water = {
  massBias: 1,
  type: "industrial",
  value: 3,
  name: "Water"
}

function getPlanetResource(planet) {
  var rtypes = Object.keys(resources)
  var resArray = []
  for(var i = 0; i < rtypes.length; i++) {
    var count = resources[rtypes[i]].massBias * planet.radius
    if(planet.type == resources[rtypes[i]])
      count *= 4
    for(var j = 0; j < count; j++) {
      resArray.push(rtypes[i])
    }
  }
  var index = Math.abs(planet.personality.hash) % resArray.length
  return resources[resArray[index]]
}