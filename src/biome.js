import {cell} from './cell';

export default function biome(cellsToCreate) {
  let _rootCell = null;
  let _totalCreated = 0;

  if (cellsToCreate > 0) {
    _rootCell = cell();
    _totalCreated++;
    cellsToCreate--;

    if (cellsToCreate > 0) {
      _totalCreated += _rootCell.create({
        cellsToCreate,
        startingDirection: "east"
      });
    }
  }

  let publicApi = {
    getRootCell() { return _rootCell; },
    getTotalCreated() { return _totalCreated; }
  };

  return publicApi;
}
