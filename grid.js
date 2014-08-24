var gridCells = []
var GRID_CELL_SIZE = 1000
var GRID_CELL_MAX_PLANETS = 1
function positionToGridCell(x, y) {
  var gridX = Math.floor(x / GRID_CELL_SIZE)
  var gridY = Math.floor(y / GRID_CELL_SIZE)
  return getGridCell(gridX, gridY)
}

function getGridCell(gridX, gridY) {
  if(!gridCells[gridX])
      gridCells[gridX] = [];
  if(!gridCells[gridX][gridY])
    gridCells[gridX][gridY] = {
      planets:[],
      npcs:[],
      x: gridX * GRID_CELL_SIZE, 
      y: gridY * GRID_CELL_SIZE,
      gridX: gridX,
      gridY: gridY};
  return gridCells[gridX][gridY];
}

function gridNeighbors(cell) {
  var neighbors = []
  neighbors.push(getGridCell(cell.gridX - 1, cell.gridY - 1))
  neighbors.push(getGridCell(cell.gridX - 1, cell.gridY))
  neighbors.push(getGridCell(cell.gridX - 1, cell.gridY + 1))
  neighbors.push(getGridCell(cell.gridX, cell.gridY - 1))
  neighbors.push(getGridCell(cell.gridX, cell.gridY + 1))
  neighbors.push(getGridCell(cell.gridX + 1, cell.gridY - 1))
  neighbors.push(getGridCell(cell.gridX + 1, cell.gridY))
  neighbors.push(getGridCell(cell.gridX + 1, cell.gridY + 1))
  return neighbors
}