var CHAT_WHEEL_RADIUS = 50
var CHAT_WHEEL_ANGLE = Math.PI/2
var CHAT_WHEEL_ARC = Math.PI/1.5
var TIME_PER_MESSAGE = 4000
function drawChatWheel() {
  if(!orbitPlanet || drawCursor || orbitPlanet.dead || orbitPlanet.beenThreatened)
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
  orbitPlanet.doneTrade = true
}
function explainTrading() {
  orbitPlanet.messageQueue = ["All worlds are connected by trade.",
                              "Some planets have certain resources, but not enough of others.",
                              "Take advantage of this to make a profit!",
                              "When you leave here we'll give you a unit of " + orbitPlanet.resource.name + " to get you going.",
                              "Come back for more if you run out."]
}
function explainWeapons() {
  orbitPlanet.messageQueue = ["As long as you have weapons in your inventory, you can fire them by pressing Z.",
                              "An aiming reticule will appear as long as you hold Z, and you can click to fire.", 
                              "Weapons are one-time use, and will disappear from your inventory when used.", 
                              "Destroying planets will give you a violent reputation. Planets will be more easily threatened,",
                              "but also more reluctant to talk to you.",
                              ]
}
function explainControls() {
  orbitPlanet.messageQueue = ["Thrust forward with W, up arrow or ,", "Rotate with A/D, left/right or A/E"]
}
function tradeClicked() {
  orbitPlanet.message = "We will offer " + orbitPlanet.tradeOffer + " " + orbitPlanet.resource.name + " for " + orbitPlanet.tradeDemand + " " + orbitPlanet.want.name
  orbitPlanet.menu = MENU_TRADING
  displayMenu()
}
function threatenClicked() {
  var fear = 9 + playerKills.length - orbitPlanet.personality.aggression;
  if(playerWeapon)
    fear += 3;
  if(fear > 9)
    fear = 9;
  if(playerKills.length == 0) {
    orbitPlanet.message = threatenResponsesPassive[fear]
    if(fear > 7) {
      if(orbitPlanet.tradeOffer == 1)
        orbitPlanet.tradeOffer = 2;
      else if (orbitPlanet.tradeOffer == 2 && orbitPlanet.tradeDemand == 3) {
        orbitPlanet.tradeOffer = 3;
        orbitPlanet.tradeDemand = 2;
      }
      else if (orbitPlanet.tradeOffer == 3 && orbitPlanet.tradeDemand == 2) {
        orbitPlanet.tradeDemand = 1;
      }
    }
    else if(fear > 8) {
      playerInventory.push(orbitPlanet.resource);
    }
  }
  else {
    orbitPlanet.message = threatenResponsesKiller[fear]
    if(fear > 4) {
      if(orbitPlanet.tradeOffer == 1)
        orbitPlanet.tradeOffer = 2;
      else if (orbitPlanet.tradeOffer == 2 && orbitPlanet.tradeDemand == 3) {
        orbitPlanet.tradeOffer = 3;
        orbitPlanet.tradeDemand = 2;
      }
      else if (orbitPlanet.tradeOffer == 3 && orbitPlanet.tradeDemand == 2) {
        orbitPlanet.tradeDemand = 1;
      }
    }
    else if(fear > 6) {
      playerInventory.push(orbitPlanet.resource);
    }
  }
  orbitPlanet.beenThreatened = true;
  updateInventory();
}
var hellos = ["...",
              "Oh great, it's you.",
              "What do you want?",
              "Hello.",
              "Hi.",
              "Hello!",
              "Hi!",
              "Welcome, friend!",
              "Hello friend!",
              "Hi friend!"]
function getPlanetHello(planet) {
  if(planet == playerHome)
    return "Welcome home!";
  var happiness_to_see_you = planet.personality.friendliness - playerKills.length * 2;
  if(planet.beenThreatened)
    happiness_to_see_you -= 3;
  if(planet.doneTrade)
    happiness_to_see_you += 1;
  if(happiness_to_see_you < 0)
    happiness_to_see_you = 0;
  if(happiness_to_see_you > 9)
    happiness_to_see_you = 9;
    
  return hellos[happiness_to_see_you];
}
var threatenResponsesPassive = ["Get the fuck out.",
                                "You wouldn't hurt a fly.",
                                "Hah! You're not that scary.",
                                "You're not that kind of guy, bud. Go away.",
                                "You don't have a reputation for being a jerk... yet.",
                                "Can't we just have peace?",
                                "We don't deal with bullies!",
                                "Please leave us alone!",
                                "Oh god, we'll improve our prices! Just don't hurt us!",
                                "Just take it and leave us alone!"]
var threatenResponsesKiller = ["You think you're tough? You don't scare me.",
                               "Give someone a weapon and they think they're all that.",
                               "Get out of here.",
                               "You're not cut out for this, bud.",
                               "Look, we don't want any trouble. Go away.",
                               "Please stop! Fine! We'll lower our prices.",
                               "No! Please! We'll lower our prices! Don't hurt us!",
                               "Oh god, no! Take this and leave us alone!",
                               "Oh god, please! No! Don't hurt us! Take everything we've got!",
                               "Oh god, not again! Fine! Take these!"]

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
  if(orbitPlanet.gossipCount > orbitPlanet.personality.friendliness - playerKills.length) {
    var annoyanceIndex = orbitPlanet.personality.friendliness - (orbitPlanet.gossipCount - orbitPlanet.personality.friendliness) - playerKills.length
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
var friendlinessGossip = ["%planet is full of angry people. No one wants to talk!",
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
  console.log(topicPlanets);
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
  var obj = array[Math.abs(Math.floor(seed) % array.length)];
  if(!obj) console.log(array, seed, obj);
  return obj
}

function replaceChar(string, newChar, index) {
  if(index > string.length - 1) return string;
  return string.substring(0, index - 1) + newChar + string.substr(index);
}