import React, { Component, PropTypes as T } from 'react'
import isObjectEqual from '../utils/isObjectEqual'

class App extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  render() {
    return React.cloneElement(this.props.children, {})
  }
}

App.propTypes = {
  children: T.element.isRequired
}

export default App
