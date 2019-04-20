import React, { Component } from 'react';
import './App.css';

import Settings from './Settings';
import Game from './Game';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: 'settings', // (settings|playing|ended)
      rules: null,
    }
  }

  screen() {
    let response = null;
    switch (this.state.state) {
      case 'settings':
        response = (
          <Settings
            onStart={(rules) => this.setState({
              rules: rules,
              state: 'playing',
            })}
          />
        );
        break;
      case 'playing':
        response = <Game rules={this.state.rules} />
        break;
      case 'ended':
        break;
      default:
        response = <h1>Invalid Game State!</h1>;
        break;
    }

    return response;
  }

  render() {
    return (
      <div className="App">
        {this.screen()}
      </div>
    );
  }
}

export default App;
