import { Component, PropTypes as T } from 'react'

class App extends Component {
  render() {
    const { children } = this.props

    return children
  }
}

App.propTypes = {
  children: T.element.isRequired
}

export default App
