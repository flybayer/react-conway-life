import React from 'react';
import ReactDOM from 'react-dom';
import { cell } from './cell';
import biome from './biome';

// DEBUGGING
window.aCell = cell();
window.cell = cell;
window.biome = biome;
// DEBUGGING

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

// TODO: DISPLAY THE BIOME!!!

const World = React.createClass({
  getInitialState() {
    const myBiome = biome(9);
    // myBiome.registerArrayUpdateCallback(this.handleStateUpdate);

    return {
      biome: myBiome,
      cells: myBiome.toArray(),
    };
  },
  // handleStateUpdate(cells) {
  //   this.setState({cells});
  // },
  render() {
    return (
      <section>
        {this.state.cells.map(row => {
          return row.map(cell => (<Cell alive={cell.alive} />))
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
