import React, { Component } from 'react';
import './App.css';
import List from './components/List';

export default class App extends Component {

  render () {
    return (
      <div>
        <div className='container'>
          <List></List>
        </div>
      </div>
    );
  }
}
