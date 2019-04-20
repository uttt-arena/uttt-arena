import React, { Component } from 'react';

class Game extends Component {
  constructor(props) {
    super(props);

    // board[i][j] = (-|white|black)
    const board = Array.apply(null, Array(9)).map(() =>
      Array.apply(null, Array(9)).map(() => '-')
    );

    this.state = {
      board: board,
      turn: 'white',
    }
  }

  handleMove(row, col) {
    const { board, turn } = this.state;
    // TODO: validate move
    board[row][col] = turn;

    this.setState({
      board: board,
      turn: (turn === 'white') ? 'black' : 'white',
    })
  }

  board() {
    return (
      <table>
        <tbody>
          {this.state.board.map((row, ir) => (
            <tr key={ir}>
              {row.map((col, ic) => (
                <td
                  key={ic}
                  onClick={this.handleMove.bind(this, ir, ic)}
                >{col.charAt(0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div>
        <h1>Game</h1>
        <b>{this.props.rules.white_player}</b>
        &nbsp;vs&nbsp;
        <b>{this.props.rules.black_player}</b>
        <h4>Board</h4>
        {this.board()}
      </div>
    );
  }
}

export default Game;
