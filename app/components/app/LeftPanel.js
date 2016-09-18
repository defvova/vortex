import React, { Component } from 'react'
import styles from './LeftPanel.scss'

class LeftPanel extends Component {
  render() {
    return (
      <div className={styles.panel}>
        <ul>
          <li className={styles.active}><span><i className='fa fa-music' /></span></li>
          <li><span><i className='fa fa-film' /></span></li>
        </ul>
      </div>
    )
  }
}

export default LeftPanel
