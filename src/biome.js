import {cell} from './cell';

export default function biome(cellsToCreate) {
  let _rootCell = null;
  let _totalCreated = 0;

  if (cellsToCreate > 0) {
    _rootCell = cell();
    _totalCreated++;

    let numCreated = _rootCell.create({
      immediate: cellsToCreate - 1,
      direction: "east"
    });
    _totalCreated += numCreated;

    if (cellsToCreate - _totalCreated > 0) {
      numCreated = _rootCell.create({
        extended: cellsToCreate - _totalCreated,
        direction: "east"
      });
      _totalCreated += numCreated;
    }
  }

  let publicApi = {
    getRootCell() { return _rootCell; },
    getTotalCreated() { return _totalCreated; }
  };

  return publicApi;
}
