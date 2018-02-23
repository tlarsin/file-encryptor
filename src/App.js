import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Dropzone from './js/Dropzone';
import Content from './js/Content';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Dropzone />
        <Content />
      </div>
    );
  }
}

export default App;
