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

// TODO: optimize biome.tick()
// TODO: sub-componentize World
// TODO: add CSS to make the webpage look nice
// TODO: figure out how to fix the "cross" shape

const World = React.createClass({
  getInitialState() {
    const myBiome = biome(450);

    return {
      biome: myBiome,
      cells: myBiome.toArray(),
    };
  },
  handleClick() {
    this.state.biome.tick();
    this.setState({cells: this.state.biome.toArray()});
  },
  render() {
    return (
      <div>
        <table>
          {this.state.cells.map(row => (
            <tr>
              {row.map(cell => (cell ? <Cell alive={cell.alive} /> : <td style={{backgroundColor: 'grey', border: '1px black solid'}}></td>) )}
            </tr>
          ))}
        </table>
        <button onClick={this.handleClick}>Tick</button>
      </div>
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
