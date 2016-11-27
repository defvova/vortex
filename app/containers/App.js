import { Component, PropTypes as T } from 'react'

class App extends Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }

  render() {
    return this.props.children
  }
}

App.propTypes = {
  children: T.element.isRequired
}

export default App
