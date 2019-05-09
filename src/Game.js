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

    this.uttt = new UTTT();

    this.state = {
      moves: [],
      turn: 'blue',
      move_row: 0,
      move_col: 0,
    }
  }

  handleMove(row, col) {
    const { turn } = this.state;
    const move = {
      player: turn,
      row: row,
      col: col,
    };

    if (!this.uttt.isValid(move.player, row, col)) {
      alert('invalid move');
      return this.setState({
        move_row: 0,
        move_col: 0
      });
    }

    this.uttt.handleMove(move.player, row, col);

    const moves = this.state.moves;
    moves.push(move);

    this.setState({
      moves: moves,
      turn: (turn !== 'blue') ? 'blue' : 'red',
    });
  }

  move(event) {
    event.preventDefault();

    this.handleMove(this.state.move_row, this.state.move_col);
  }

  render() {
    return (
      <div>
        <b>{this.props.rules.white_player}</b>
        &nbsp;vs&nbsp;
        <b>{this.props.rules.black_player}</b>
        <h4>Moves</h4>
        <ul>
          {this.state.moves.map(move => (
            <li>{move.player} - ({move.row}, {move.col})</li>
          ))}
        </ul>

        <h4>Board</h4>
        <label>{this.uttt.status}</label>

        <table>
          <tbody>
            {this.uttt.board.map(row => (
              <tr>
                {row.map(ttt => (
                  <td>
                    <label>{JSON.stringify(ttt.winner, null, ' ')}</label>
                    <pre>
                    {ttt.board.map(row => {
                      row = row.map(col => col ? col.charAt(0) : '-');
                      return row.join('');
                    }).join('\n')}
                    </pre>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <form>
          <label>row</label>
          <input
            value={this.state.move_row}
            onChange={e => this.setState({ move_row: +e.target.value })}
          />
          <label>col</label>
          <input
            value={this.state.move_col}
            onChange={e => this.setState({ move_col: +e.target.value })}
          />
          <button onClick={this.move.bind(this)}>move!</button>
        </form>
      </div>
    );
  }
}

export default Game;
