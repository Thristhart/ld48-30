function onLoad(event) {
  canvas = document.getElementById("display")
  context = canvas.getContext("2d")
  
  registerInputEvents()
  
  window.requestAnimationFrame(render)
}
window.addEventListener("load", onLoad)