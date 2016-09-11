import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import { ipcRenderer } from 'electron'
import configStore from '../utils/configstore'

class Home extends Component {
  handle = () => {
    ipcRenderer.send('get-vk-permission')
  }

  getData = () => {
    console.log(configStore.get('vk'))
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link>
          <br />
          <a onClick={this.handle}>OAuth</a>
          <br />
          <a onClick={this.getData}>GetData</a>
        </div>
      </div>
    );
  }
}

export default Home
