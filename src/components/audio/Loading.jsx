import React, { Component, PropTypes as T, createElement as el } from 'react'
import renderIf from '../../utils/renderif'

class Loading extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.isLoading !== this.props.isLoading
  }

  render() {
    return renderIf(this.props.isLoading) (
      el('div', { className: 'loading' },
        el('span'),
        el('span'),
        el('span'),
        el('span'),
        el('span')
      )
    )
  }
}

Loading.propTypes = {
  isLoading: T.bool.isRequired
}

export default Loading
