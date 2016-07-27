import {cell} from './cell';

export default function biome(cellsToCreate) {
  let _rootCell = null;
  let _totalCreated = 0;
  let _cellObjectArray = [];
  let _cellArray = [];

  if (cellsToCreate > 0) {
    // ----------------
    // CREATE ALL CELLS
    // ----------------
    _rootCell = cell();
    _totalCreated++;
    cellsToCreate--;

    if (cellsToCreate > 0) {
      _totalCreated += _rootCell.create({
        cellsToCreate,
        startingDirection: "east"
      });
    }


    // --------------------------
    // CALCULATE BIOME DIMENSIONS
    // --------------------------
    let currentCell = null;
    let height = 1; // Init to 1 to count for rootCell
    let northmostNeighbor = _rootCell;

    // Start at center and walk through the neighbors northward
    currentCell = _rootCell;
    while(true) {
      const northNeighbor = currentCell.getNeighbors().north;
      if (northNeighbor == null) break;
      height++;
      currentCell = northNeighbor;
      northmostNeighbor = northNeighbor;
    }

    // Start at center and walk through the neighbors southward
    currentCell = _rootCell;
    while(true) {
      const southNeighbor = currentCell.getNeighbors().south;
      if (southNeighbor == null) break;
      height++;
      currentCell = southNeighbor;
    }

    // Start at center and walk through the neighbors westward
    let cellsWest = 0;
    currentCell = _rootCell;
    while(true) {
      const westNeighbor = currentCell.getNeighbors().west;
      if (westNeighbor == null) break;
      cellsWest++;
      currentCell = westNeighbor;
    }

    // Start at center and walk through the neighbors eastward
    let cellsEast = 0;
    currentCell = _rootCell;
    while(true) {
      const eastNeighbor = currentCell.getNeighbors().east;
      if (eastNeighbor == null) break;
      cellsEast++;
      currentCell = eastNeighbor;
    }

    // Calculate width from above surveys
    let width = cellsWest + 1 + cellsEast;

    // Make _cellObjectArray large enough to contain all cells
    for (let row = 0; row < height; row++) {
      _cellObjectArray.push(Array(width));
    }


    // ---------------------------------
    // ADD ALL CELLS TO THE OBJECT ARRAY
    // ---------------------------------
    let centerCellOfThisRow = northmostNeighbor;

    // Loop over each row of the biome, starting at the top (north)
    for (let row = 0; row < height; row++) {

      // save west cells into the objectArray
      currentCell = centerCellOfThisRow;
      for (let stepWest = 1; stepWest <= cellsWest; stepWest++) {
        const westNeighbor = currentCell.getNeighbors().west;
        _cellObjectArray[row][cellsWest - stepWest] = westNeighbor;
        if (westNeighbor != null) currentCell = westNeighbor;
      }

      // save center cell into the objectArray
      _cellObjectArray[row][cellsWest] = centerCellOfThisRow;

      // save east cells into the objectArray
      currentCell = centerCellOfThisRow;
      for (let stepEast = 1; stepEast <= cellsEast; stepEast++) {
        const eastNeighbor = currentCell.getNeighbors().east;
        _cellObjectArray[row][cellsWest + stepEast] = eastNeighbor;
        if (eastNeighbor != null) currentCell = eastNeighbor;
      }

      // Set new center to be 1 row below the current row for the next iteration
      centerCellOfThisRow = centerCellOfThisRow.getNeighbors().south;
    }
  } // End of if (cellsToCreate > 0)


  let publicApi = {
    getRootCell() { return _rootCell; },
    getTotalCreated() { return _totalCreated; },
    getCellObjectArray() { return _cellObjectArray; },
    toArray() {
      return _cellObjectArray.map(row => (
        row.map(cell => (cell ? {alive: cell.isAlive()} : null) )
      ));
    }
  };

  return publicApi;
}
