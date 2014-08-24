var CHAT_WHEEL_RADIUS = 50
var CHAT_WHEEL_ANGLE = Math.PI/2
var CHAT_WHEEL_ARC = Math.PI/1.5
var TIME_PER_MESSAGE = 4000
function drawChatWheel() {
  if(!orbitPlanet)
    return false;
  displayMenu()
  if(orbitPlanet.messageQueue) {
    if(!orbitPlanet.lastPopTime) {
      orbitPlanet.lastPopTime = new Date().getTime()
      orbitPlanet.message = orbitPlanet.messageQueue.shift()
    }
    if(new Date().getTime() - orbitPlanet.lastPopTime > TIME_PER_MESSAGE) {
      orbitPlanet.lastPopTime = new Date().getTime()
      orbitPlanet.message = orbitPlanet.messageQueue.shift()
      if(orbitPlanet.messageQueue.length == 0) {
        orbitPlanet.messageQueue = null
      }
    }
    return
  }
  context.strokeStyle = "white"
  context.fillStyle = "#122766"
  context.font = (20 / cameraScale) + "px Segoe UI"
  var leftAngle = CHAT_WHEEL_ANGLE + CHAT_WHEEL_ARC/2
  var midAngle = CHAT_WHEEL_ANGLE
  var rightAngle = CHAT_WHEEL_ANGLE - CHAT_WHEEL_ARC/2
  
  var leftMin = midAngle + CHAT_WHEEL_ARC/4
  var leftMax = leftMin + CHAT_WHEEL_ARC/2
  var rightMax = midAngle - CHAT_WHEEL_ARC/4
  var rightMin = rightMax - CHAT_WHEEL_ARC/2
  var midMin = rightMax
  var midMax = leftMin
  
  var leftX = playerX + Math.cos(leftAngle) * CHAT_WHEEL_RADIUS/cameraScale
  var leftY = playerY + Math.sin(leftAngle) * CHAT_WHEEL_RADIUS/cameraScale
  var rightX = playerX + Math.cos(rightAngle) * CHAT_WHEEL_RADIUS/cameraScale
  var rightY = playerY + Math.sin(rightAngle) * CHAT_WHEEL_RADIUS/cameraScale
  var midX = playerX + Math.cos(midAngle) * CHAT_WHEEL_RADIUS/cameraScale
  var midY = playerY + Math.sin(midAngle) * CHAT_WHEEL_RADIUS/cameraScale
  context.beginPath()
  context.moveTo(playerX, playerY)
  if(cursorAngle > leftMin && cursorAngle < leftMax) {
    selectedChat = chatWheelLeft;
  }
  else if(cursorAngle > midMin && cursorAngle < midMax) {
    selectedChat = chatWheelMid;
  }
  else if(cursorAngle > rightMin && cursorAngle < rightMax) {
    selectedChat = chatWheelRight;
  }
  if(selectedChat == chatWheelLeft)
    context.arc(playerX, playerY, CHAT_WHEEL_RADIUS/cameraScale, leftMin, leftMax)
  if(selectedChat == chatWheelMid)
    context.arc(playerX, playerY, CHAT_WHEEL_RADIUS/cameraScale, midMin, midMax)
  if(selectedChat == chatWheelRight)
    context.arc(playerX, playerY, CHAT_WHEEL_RADIUS/cameraScale, rightMin, rightMax)
  context.closePath()
  context.fill()
  
  context.fillStyle = "white"
  var leftWidth = context.measureText(chatWheelLeft.display).width
  var midWidth = context.measureText(chatWheelMid.display).width
  var rightWidth = context.measureText(chatWheelRight.display).width
  context.fillText(chatWheelLeft.display, leftX - leftWidth, leftY)
  context.fillText(chatWheelMid.display, midX - midWidth / 2, midY + 10)
  context.fillText(chatWheelRight.display, rightX, rightY)
}
var chatWheelLeft = {}
var chatWheelMid = {}
var chatWheelRight = {}
var selectedChat = null

var MENU_HELLO = 0
var MENU_TRADING = 1
var MENU_GOSSIP = 2
var MENU_HOME = 2
function displayMenu() {
  if(orbitPlanet.menu == MENU_HELLO) {
    chatWheelLeft = {display: "trade", clicked: tradeClicked}
    chatWheelMid = {display: "threaten", clicked: threatenClicked}
    chatWheelRight = {display: "gossip", clicked: gossipClicked}
  }
  if(orbitPlanet.menu == MENU_HOME) {
    orbitPlanet.message = "Welcome home!"
    chatWheelLeft = {display: "trading", clicked: explainTrading}
    chatWheelMid = {display: "weapons", clicked: explainWeapons}
    chatWheelRight = {display: "piloting", clicked: explainControls}
  }
  if(orbitPlanet.menu == MENU_TRADING) {
    if(playerHasResource(orbitPlanet.want, orbitPlanet.tradeDemand)) {
      chatWheelLeft.display = "deal!"
      chatWheelLeft.clicked = makeTradeHappen;
    }
    else {
      chatWheelLeft.display = ""
    }
    chatWheelMid.display = ""
    chatWheelMid.clicked = function(){}
    chatWheelRight.clicked = function() {
      orbitPlanet.message = "Whatever."
    if(orbitPlanet.personality.friendliness > 3)
      orbitPlanet.message = "Fine."
    if(orbitPlanet.personality.friendliness > 6)
      orbitPlanet.message = "That's okay!"
      orbitPlanet.menu = MENU_HELLO
      displayMenu()
    }
    chatWheelRight.display = "no"
  }
}
function makeTradeHappen() {
  for(var i = 0; i < orbitPlanet.tradeDemand; i++) {    
    playerInventory.splice(playerInventory.indexOf(orbitPlanet.want), 1)
  }
  for(var i = 0; i < orbitPlanet.tradeOffer; i++) {    
    playerInventory.push(orbitPlanet.resource)
  }
  orbitPlanet.message = "Good."
  if(orbitPlanet.personality.friendliness > 3)
    orbitPlanet.message = "Thanks."
  if(orbitPlanet.personality.friendliness > 6)
    orbitPlanet.message = "Thank you so much!"
  orbitPlanet.menu = MENU_HELLO;
  displayMenu();
  updateInventory();
}
function explainTrading() {
  orbitPlanet.messageQueue = ["All worlds are connected by trade.",
                              "Some planets have certain resources",
                              "but not enough of others",
                              "take advantage of this to make a profit",
                              "when you leave here we'll give you " + orbitPlanet.resource.name]
}
function explainWeapons() {
  orbitPlanet.messageQueue = ["idk lol shoot them", "nerd"]
}
function explainControls() {
  orbitPlanet.messageQueue = ["Thrust forward with \nW, up arrow or ,", "Rotate with A/D, left/right\nor A/E"]
}
function tradeClicked() {
  orbitPlanet.message = "We will offer " + orbitPlanet.tradeOffer + " " + orbitPlanet.resource.name + " for " + orbitPlanet.tradeDemand + " " + orbitPlanet.want.name
  orbitPlanet.menu = MENU_TRADING
  displayMenu()
}
function threatenClicked() {
  orbitPlanet.message = "lol plz"
}

var gossipBrushoffs = ["Fuck off.",
                       "That's all you're getting out of me.",
                       "That's all I've heard.",
                       "That's it!",
                       "I don't know anything else.",
                       "Sorry, that's all I've heard around here.",
                       "That's all I know, bud!",
                       "Sorry friend, that's everything I know!",
                       "Sorry buddy, that's all I got.",
                       "I'm sorry! That was the last one I knew."]
function gossipClicked() {
  orbitPlanet.gossipCount++
  if(orbitPlanet.gossipCount > orbitPlanet.personality.friendliness) {
    var annoyanceIndex = orbitPlanet.personality.friendliness - (orbitPlanet.gossipCount - orbitPlanet.personality.friendliness)
    if(annoyanceIndex < 0) annoyanceIndex = 0
    orbitPlanet.message = gossipBrushoffs[annoyanceIndex]
  }
  else {
    generateGossip(orbitPlanet)
  }
}

var gossipTopics = ["aggression", "wealth", "friendliness", "resource"];
var aggressionGossip = ["%planet is full of total wusses!",
                        "I heard %name on %planet just ordered a complete demilitarization!",
                        "%name from %planet is the worst military leader I've ever heard of.",
                        "The defenses at %planet seem a little disorganized to me.",
                        "%planet is one of the few planets around here with a decent military!",
                        "%planet has a strong military presence.",
                        "%planet has a very disciplined military!",
                        "%planet has been really gearing up on their military recently.",
                        "I hear %planet is in martial law. %name is terrifying!",
                        "The people of %planet are violent and scary! I suggest staying away."]
var wealthGossip =      ["%planet is so poor right now. They've got nothing left!",
                        "%name from %planet has gone bankrupt!",
                        "Trade in %planet isn't exactly on the rise if you know what I mean.",
                        "%planet has a lot of really stingy traders.",
                        "%planet has a growing economy!",
                        "I heard %name on %planet just bought a nice house.",
                        "%planet has become a real hub of commerce!",
                        "%planet is where the smart traders go to make deals.",
                        "I hear %planet is so wealthy, they've giving stuff away just to get rid of it!",
                        "%planet is definitely the wealthiest world around here."]
var friendlinessGossip = ["%planet is a hive of scum and villainy. No one wants to talk!",
                          "%name from %planet is a real sour grape.",
                          "%planet is getting a reputation for being full of jerks!",
                          "There must be something in the air at %planet. They're all pretty mean there.",
                          "There's some interesting stuff to hear at %planet.",
                          "%planet is a pretty exciting place with some nice people.",
                          "%planet is my go-to source for news around here.",
                          "Everyone at %planet is so kind! They'll always talk to you.",
                          "%name at %planet is the most reliable source of information in the area.",
                          "I swear, it seems like %planet is the hub for news in the entire universe."]
var resourceHaveGossip = {
  weapons: ["I hear the weapon designers at %planet are the best in the system.",
            "Turns out %name at %planet is stockpiling weapons for something."],
  gems: ["They found a huge gem mine in %planet!",
         "I think %name is keeping a stash of gems at %planet."],
  water: ["Did you know that %planet is 80% water?",
         "%name is stockpiling water at %planet. If you're thirsty, head there!"],
  food: ["The farmers at %planet are so skilled!",
         "Hungry? %name's Grocery at %planet has got you covered."],
  iron: ["The iron mines of %planet are HUGE!",
         "%name runs the iron refineries in %planet like a well-oiled machine."],
  gold: ["They say the streets of %planet are paved in gold!",
         "I hear %name owns the largest gold mine on %planet."]
            
}
var resourceWantGossip = {
  weapons: ["I hear %planet is looking for weapons.",
            "%name from %planet told me he'd do anything for some weapons."],
  gems: ["The one thing %planet is lacking is some nice gems.",
         "You know %name, from %planet? I hear he's after good gems to propose with."],
  water: ["The people of %planet are in a huge drought.",
         "%name is in desperate need of water. If you have some, bring it to %planet!"],
  food: ["The farms of %planet have run dry, and they need food badly.",
         "%name from %planet told me that there is no food left there!"],
  iron: ["I heard %planet is importing iron like crazy.",
         "%name of %planet is really into collecting iron, I've heard."],
  gold: ["Everyone needs gold, but %planet needs it a lot!",
         "Need a quick sell? Take your spare gold to %name on %planet!"]
}
function generateGossip(planet) {
  var grid = positionToGridCell(planet.x, planet.y);
  var neighbors = gridNeighbors(grid);
  var topicPlanets = [];
  for(var i = 0; i < neighbors.length; i++) {
    topicPlanets = topicPlanets.concat(neighbors[i].planets);
  }
  var topicPlanet = selectA(topicPlanets);
  var topic = selectA(gossipTopics);
  var line = ""
  if(topic == "aggression") {
    var gossip_index = topicPlanet.personality.aggression
    line = aggressionGossip[gossip_index]
  }
  if(topic == "wealth") {
    var gossip_index = topicPlanet.personality.wealth
    line = wealthGossip[gossip_index]
  }
  if(topic == "friendliness") {
    var gossip_index = topicPlanet.personality.friendliness
    line = friendlinessGossip[gossip_index]
  }
  if(topic == "resource") {
    if(Math.random() * 2 > 1) {
      var resource = topicPlanet.resource.name
      line = selectA(resourceHaveGossip[resource])
    }
    else {
      var resource = topicPlanet.want.name
      line = selectA(resourceWantGossip[resource])
    }
  }
  planet.message = translateGossipLine(topicPlanet, line);
}
function translateGossipLine(planet, line) {
  line = line.replace("%planet", planet.name)
  line = line.replace("%name", generateHumanName(planet))
  return line; // steal razzle's bank account
}

function generateHumanName(planet) {
  var seed = planet.personality.hash; // still not actually a seed shhh
  
  var hardConsonants = "bcdgkpqrtvzx".split("")
  var softConsonants = "fhjmnprsw".split("")
  var vowels = "aeiou".split("")
  
  var prefixStructures = ["hvs", "svh", "vh'", "hvh'", "hvh", "hvsh", "vvs"]
  var suffixStructures = ["svh", "hvs", "hvh", "vshv", "vsv", "vh"]
  
  var prefix = selectBySeed(prefixStructures, seed);
  var suffix = selectBySeed(suffixStructures, seed);
  var name = prefix + suffix;
  for(var i = 0; i < name.length; i++) {
    if(name[i] == "h") {
      name = replaceChar(name, selectBySeed(hardConsonants, seed << i), i);
    }
    else if(name[i] == "s") {
      name = replaceChar(name, selectBySeed(softConsonants, seed << i), i);
    }
    else if(name[i] == "v") {
      name = replaceChar(name, selectBySeed(vowels, seed << i), i);
    }
    
    if(i == 0)
      name = replaceChar(name, name[i].toUpperCase(), i)
  }
  return name;
}
function selectBySeed(array, seed) {
  return array[Math.abs(Math.floor(seed) % array.length)];
}

function replaceChar(string, newChar, index) {
  if(index > string.length - 1) return string;
  return string.substring(0, index - 1) + newChar + string.substr(index);
}