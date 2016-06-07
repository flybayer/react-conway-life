window.cell = function() {
  let _alive = false;
  const _neighbors = {
    top: null,
    topRight: null,
    right: null,
    bottomRight: null,
    bottom: null,
    bottomLeft: null,
    left: null,
    topLeft: null
  };

  const passesRule2 = (isAlive, livingNeighbors) => (
    //Rules 1 & 3 are just clarifications of rule 3
    //Only passes if alive and has 2 or 3 living neighbors
    isAlive && (livingNeighbors === 2 || livingNeighbors === 3)
  );
  const passesRule4 = (isAlive, livingNeighbors) => (
    //Only passes if dead and has 3 living neighbors
    !isAlive && livingNeighbors === 3
  );
  const passesAnyRule = (...args) => (passesRule2(...args) || passesRule4(...args));

  function willLive() {
    let livingNeighbors = 0;
    for (let neighbor in _neighbors) {
      if (!_neighbors[neighbor]) continue;
      if (_neighbors[neighbor].isAlive()) livingNeighbors++;
    }
    return passesAnyRule(_alive, livingNeighbors)
  }

  const publicApi = {
    isAlive() { return _alive; },
    willLive: willLive
  };

  return publicApi;
};

window.aCell = cell();

const Cell = (props) => (
  <div
    style={{
      backgroundColor: props.alive ? 'yellow' : 'black',
      border: '1px red solid',
      display: 'inline-block',
      height: 20, //props.height???
      width: 20
    }}
  ></div>
);

const World = React.createClass({
  getInitialState() {
    return {
      cells: [
        {
          alive: false
        },
        {
          alive: true
        },
        {
          alive: false
        },
        {
          alive: false
        }
      ]
    };
  },
  render() {
    return (
      <section>
        {this.state.cells.map(function mapCells(cell) {
          return <Cell alive={cell.alive} />
        })}
      </section>
    );
  }
});

const App = React.createClass({
  render() {
    return (
      <World />
    );
  }
})

ReactDOM.render(
  <section>
    <h1>Conway's Game of Life</h1>
    <App />
  </section>,
  document.getElementById('main')
);
