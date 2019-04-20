import React, { Component } from 'react';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.players = [{
      label: 'Human',
      value: 'human',
    }];

    this.state = {
      white_player: 'human',
      black_player: 'human',
      move_time: 60000,
    };
  }

  handleStart(e) {
    e.preventDefault();

    if (typeof this.props.onStart === 'function') {
      this.props.onStart(this.state);
    }
  }

  render() {
    return (
      <div>
        <h1>resource.empty-arena.png</h1>
        <h4>Players</h4>
        <div>
          <select
            value={this.state.white_player}
            onChange={(e) => this.setState({ white_player: e.target.value })}
          >
            {this.players.map(player => (
              <option
                key={player.value}
                value={player.value}
              >
                {player.label}
              </option>
            ))}
          </select>
          vs
          <select
            value={this.state.black_player}
            onChange={(e) => this.setState({ black_player: e.target.value })}
          >
            {this.players.map(player => (
              <option
                key={player.value}
                value={player.value}
              >
                {player.label}
              </option>
            ))}
          </select>
        </div>
        <h4>Rules</h4>
        <div>
          <div>
            Move time
            <input
              type="text"
              value={this.state.move_time}
              onChange={e => this.setState({ move_time: +e.target.value })}
            />
            {this.state.move_time}
          </div>
        </div>

        <button onClick={this.handleStart.bind(this)}>start</button>
      </div>
    );
  }
}

export default Settings;
