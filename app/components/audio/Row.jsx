import React, { Component, PropTypes as T, createElement as el } from 'react'
import I from 'react-immutable-proptypes'
import classNames from 'classnames'
import { connect } from 'react-redux'
import formatTime from '../../utils/formatTime'
import isObjectEqual from '../../utils/isObjectEqual'
import { STATUS } from '../../constants'

class Row extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  render() {
    const { song, cls, index, clickHandler } = this.props,
          { currentAid, currentStatus } = this.props.player.toObject(),
          { title, artist, duration, aid } = song.toObject(),
          className = classNames({
            'active': aid == currentAid && currentStatus !== STATUS.stopped
          })

    return (
      el('tr', { key: index, onClick: clickHandler.bind(this, aid), className },
        el('td', { className: 'is-icon' },
          el('a', { className }, el('i', { value: aid, className: `fa fa-${cls}` }))
        ),
        el('td', {}, el('b', {}, artist), ' - ', el('i', {}, title)),
        el('td', { className: 'has-text-right' }, el('span', {}, formatTime(duration)))
      )
    )
  }
}

Row.propTypes = {
  song: I.mapContains({
    aid: T.number.isRequired,
    title: T.string.isRequired,
    artist: T.string.isRequired,
    duration: T.number.isRequired
  }).isRequired,
  cls: T.string.isRequired,
  index: T.number.isRequired,
  clickHandler: T.func.isRequired,
  player: I.mapContains({
    currentAid: T.number,
    currentStatus: T.string
  }).isRequired
}

function mapStateToProps(state) {
  return {
    player: state.get('player')
  }
}

export default connect(mapStateToProps)(Row)
