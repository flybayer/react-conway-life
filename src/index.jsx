import React from 'react';
import ReactDOM from 'react-dom';
import { cell } from './cell';

window.aCell = cell();
window.cell = cell;

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
