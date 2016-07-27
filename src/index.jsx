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
  <td
    style={{
      backgroundColor: props.alive ? 'yellow' : 'black',
      border: '1px red solid',
      height: 20, //props.height???
      width: 20
    }}
  ></td>
);


const World = React.createClass({
  getInitialState() {
    const myBiome = biome(40);
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
      <table>
        {this.state.cells.map(row => (
          <tr>
            {row.map(cell => (cell ? <Cell alive={cell.alive} /> : <td style={{backgroundColor: 'grey', border: '1px black solid'}}></td>) )}
          </tr>
        ))}
      </table>
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
