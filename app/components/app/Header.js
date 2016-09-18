import React, { Component } from 'react'
import styles from './Header.scss'
import { ipcRenderer } from 'electron'

class Header extends Component {
  handleVkLogin = () => {
    ipcRenderer.send('get-vk-permission')
  }

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.nav}>
          <a onClick={this.handleVkLogin.bind()}>
            <i className='fa fa-vk'></i>
          </a>
        </div>
      </header>
    )
  }
}

export default Header
