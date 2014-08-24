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
    chatWheelLeft = {display: "trading", clicked: explainTrading}
    chatWheelMid = {display: "weapons", clicked: explainWeapons}
    chatWheelRight = {display: "piloting", clicked: explainControls}
  }
  if(orbitPlanet.menu == MENU_TRADING) {
    if(playerHasResource(orbitPlanet.want)) {
      chatWheelLeft.display = "Deal!"
    }
    else {
      chatWheelLeft.display = ""
    }
    chatWheelMid.display = ""
    chatWheelMid.clicked = function(){}
    chatWheelRight.clicked = function() {
      orbitPlanet.message = "Fine."
      orbitPlanet.menu = MENU_HELLO
      displayMenu()
    }
    chatWheelRight.display = "No"
  }
}
function explainTrading() {
  orbitPlanet.messageQueue = ["All worlds are \nconnected by trade.", "Some planets have certain \nresources", "but not enough of others", "take advantage of \nthis to make a profit", "when you leave here\nwe'll give you\n" + orbitPlanet.resource.name]
}
function explainWeapons() {
  orbitPlanet.messageQueue = ["idk lol shoot them", "nerd"]
}
function explainControls() {
  orbitPlanet.messageQueue = ["Thrust forward with \nW, up arrow or ,", "Rotate with A/D, left/right\nor A/E"]
}
function tradeClicked() {
  orbitPlanet.message = "Have: " + orbitPlanet.resource.name + "\nWant: " + orbitPlanet.want.name 
  orbitPlanet.menu = MENU_TRADING
  displayMenu()
}
function threatenClicked() {
  orbitPlanet.message = "lol plz"
}
function gossipClicked() {
  orbitPlanet.message = "i heard ur dumb"
}