var resources = {}

var planetTypes = ["industrial", "luxury", "labor"]
resources.iron = {
  massBias: 1,
  type: "industrial",
  value: 2,
  name: "iron"
}
resources.weapons = {
  massBias: 1,
  type: "industrial",
  value: 5,
  name: "weapons"
}
resources.gems = {
  massBias: 2,
  type: "luxury",
  value: 3,
  name: "gems"
}
resources.gold = {
  massBias: 1,
  type: "luxury",
  value: 4,
  name: "gold"
}
resources.food = {
  massBias: 3,
  type: "labor",
  value: 2,
  name: "food"
}
resources.water = {
  massBias: 1,
  type: "labor",
  value: 3,
  name: "water"
}

function getPlanetResource(planet) {
  var rtypes = Object.keys(resources)
  var resArray = []
  for(var i = 0; i < rtypes.length; i++) {
    var count = resources[rtypes[i]].massBias * planet.radius
    count /= resources[rtypes[i]].value
    if(planet.type == resources[rtypes[i]])
      count *= 4
    count = Math.floor(count)
    for(var j = 0; j < count; j++) {
      resArray.push(rtypes[i])
    }
  }
  var index = Math.abs(planet.personality.hash) % resArray.length
  return resources[resArray[index]]
}
function getPlanetDesiredResource(planet) {
  var rtypes = Object.keys(resources)
  var resArray = []
  for(var i = 0; i < rtypes.length; i++) {
    if(rtypes[i] == planet.resource.name)
      continue;
    var count = planet.radius / resources[rtypes[i]].massBias
    if(planet.resource.type != resources[rtypes[i]].type)
      count *= 4
    for(var j = 0; j < count; j++) {
      resArray.push(rtypes[i])
    }
  }
  var index = Math.abs(planet.personality.hash) % resArray.length
  return resources[resArray[index]]
}
function generateQuest(planet) {
  var goals = []
  var rtypes = Object.keys(resources)
  for(var i = 0; i < 3; i++) {
    var type = selectBySeed(rtypes, planet.personality.hash << i)
    goals.push(resources[type]);
  }
  return goals
}