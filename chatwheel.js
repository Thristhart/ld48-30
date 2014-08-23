var CHAT_WHEEL_RADIUS = 50
var CHAT_WHEEL_ANGLE = Math.PI/2
var CHAT_WHEEL_ARC = Math.PI/1.5
function drawChatWheel() {
  if(!orbitPlanet)
    return false;
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
  
  var leftX = playerX + Math.cos(leftAngle) * CHAT_WHEEL_RADIUS
  var leftY = playerY + Math.sin(leftAngle) * CHAT_WHEEL_RADIUS
  var rightX = playerX + Math.cos(rightAngle) * CHAT_WHEEL_RADIUS
  var rightY = playerY + Math.sin(rightAngle) * CHAT_WHEEL_RADIUS
  var midX = playerX + Math.cos(midAngle) * CHAT_WHEEL_RADIUS
  var midY = playerY + Math.sin(midAngle) * CHAT_WHEEL_RADIUS
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
    context.arc(playerX, playerY, CHAT_WHEEL_RADIUS, leftMin, leftMax)
  if(selectedChat == chatWheelMid)
    context.arc(playerX, playerY, CHAT_WHEEL_RADIUS, midMin, midMax)
  if(selectedChat == chatWheelRight)
    context.arc(playerX, playerY, CHAT_WHEEL_RADIUS, rightMin, rightMax)
  context.closePath()
  context.fill()
  
  context.fillStyle = "white"
  context.fillText(chatWheelLeft.display, leftX - 30, leftY)
  context.fillText(chatWheelMid.display, midX - 40, midY + 10)
  context.fillText(chatWheelRight.display, rightX, rightY)
}
var chatWheelLeft = {display: "trade", clicked: leftClicked}
var chatWheelMid = {display: "threaten", clicked: midClicked}
var chatWheelRight = {display: "gossip", clicked: rightClicked}
var selectedChat = null

var MENU_HELLO = 0
var MENU_TRADING = 1
var MENU_GOSSIP = 2
function leftClicked() {
  if(orbitPlanet.menu == MENU_HELLO) { // he wants to trade
    orbitPlanet.message = "Have: " + orbitPlanet.resource.name + "\nWant: " + orbitPlanet.want.name 
    orbitPlanet.menu = MENU_TRADING
    if(playerHasResource(orbitPlanet.resource)) {
      chatWheelLeft.display = "Deal!"
    }
    else {
      chatWheelLeft.display = ""
    }
    chatWheelMid.display = ""
    chatWheelMid.clicked = function(){}
    chatWheelRight.clicked = function() {
      orbitPlanet.message = "Fine."
      resetToHello()
    }
    chatWheelRight.display = "No"
  }
}
function midClicked() {
  orbitPlanet.message = "lol plz"
}
function rightClicked() {
  orbitPlanet.message = "i heard ur dumb"
}
function resetToHello() {
  orbitPlanet.menu = MENU_HELLO
  chatWheelLeft = {display: "trade", clicked: leftClicked}
  chatWheelMid = {display: "threaten", clicked: midClicked}
  chatWheelRight = {display: "gossip", clicked: rightClicked}
}