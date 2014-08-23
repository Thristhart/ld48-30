function onLoad(event) {
  canvas = document.getElementById("display")
  context = canvas.getContext("2d")
  
  addPlanet(256, 256, 50)
  
  registerInputEvents()
  
  window.requestAnimationFrame(render)
}
window.addEventListener("load", onLoad)