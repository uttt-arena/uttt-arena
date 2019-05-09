import React, { Component } from 'react';

/*
 * arena asks current player to move
 * arena waits til current player 'moves' (max 15s for AI)
 * arena verifies and informs that move is valid
 * arena toggles current player
 */

class TTT {
  constructor() {
    this.status = 'at_stake'; // (at_stake,won,tied)
    this.winner = null;
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]
  }

  isValid(player, row, col) {
    return (
      (0 <= row && row < 3) &&
      (0 <= col && col < 3) &&
      this.status === 'at_stake' &&
      this.board[row][col] === null
    );
  }

  handleMove(player, row, col) {
    if (!this.isValid(player, row, col)) {
      return -1;
    }

    this.board[row][col] = player;
    this.calcStatus();
  }

  calcStatus() {
    const { board } = this;
    for (let i = 0; i < 3; i += 1) {
      const ref = board[i][i];
      if (ref === null) {
        continue;
      }

      let vert = true, hori = true;
      for (let j = 0; j < 3; j += 1) {
        vert &= (board[j][i] === ref);
        hori &= (board[i][j] === ref);
      }

      if (vert || hori) {
        this.status = 'won'
        this.winner = ref;
      }
    }
  }
}

class UTTT {
  constructor() {
    this.status = 'at_stake';
    this.board = [
      [new TTT(), new TTT(), new TTT()],
      [new TTT(), new TTT(), new TTT()],
      [new TTT(), new TTT(), new TTT()],
    ]
  }

  isValid(player, row, col) {
    if (
      !(0 <= row && row < 9) ||
      !(0 <= col && col < 9) ||
      this.status !== 'at_stake'
    ) {
      return false;
    }

    const big_row = Math.trunc(row / 3);
    const big_col = Math.trunc(col / 3);
    const sub_row = row % 3;
    const sub_col = col % 3;
    const sub_board = this.board[big_row][big_col];

    return sub_board.isValid(player, sub_row, sub_col);
  }

  handleMove(player, row, col) {
    if (!this.isValid(player, row, col)) {
      return -1;
    }

    const big_row = Math.trunc(row / 3);
    const big_col = Math.trunc(col / 3);
    const sub_row = row % 3;
    const sub_col = col % 3;
    const sub_board = this.board[big_row][big_col];

    sub_board.handleMove(player, sub_row, sub_col);

    this.calcStatus();
  }

  calcStatus() {
    const { board } = this;
    for (let i = 0; i < 3; i += 1) {
      const ref = board[i][i];
      if (ref.winner === null) {
        continue;
      }

      let vert = true, hori = true;
      for (let j = 0; j < 3; j += 1) {
        vert &= (board[j][i].winner === ref.winner);
        hori &= (board[i][j].winner === ref.winner);
      }

      if (vert || hori) {
        this.status = 'won'
        this.winner = ref.winner;
      }
    }
  }
}

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
