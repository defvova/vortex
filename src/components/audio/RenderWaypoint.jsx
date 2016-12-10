import React, { Component, PropTypes as T, createElement as el } from 'react'
import Waypoint from 'react-waypoint'
import _throttle from 'lodash/throttle'
import renderIf from '../../utils/renderif'
import isObjectEqual from '../../utils/isObjectEqual'

class RenderWaypoint extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  handleMore = () => {
    const { onLoadMoreAudio, step, maxStep } = this.props

    onLoadMoreAudio(step, maxStep)
  }

  render() {
    let throttledHandler = null

    return renderIf(!this.props.isLoading) (
      el('tr', {},
        el('td', { className: 'is-paddingless' },
          el(Waypoint, {
            onEnter: this.handleMore.bind(),
            throttleHandler: (scrollHandler) => {
              throttledHandler = _throttle(scrollHandler, 300)
              return throttledHandler
            },
            ref: (component) => {
              if (throttledHandler && !component) {
                throttledHandler.cancel()
              }
            }
          })
        )
      )
    )
  }
}

RenderWaypoint.propTypes = {
  onLoadMoreAudio: T.func.isRequired,
  step: T.number.isRequired,
  maxStep: T.number.isRequired,
  isLoading: T.bool.isRequired
}

export default RenderWaypoint
