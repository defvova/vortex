import React, { Component, PropTypes } from 'react'
import Header from '../components/app/Header'
import LeftPanel from '../components/app/LeftPanel'
import RightPanel from '../components/app/RightPanel'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div>
        <Header />
        <LeftPanel />
        <RightPanel />
        {this.props.children}
      </div>
    )
  }
}
