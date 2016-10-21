import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import classNames from 'classnames'
import Waypoint from 'react-waypoint'
import throttle from 'lodash.throttle'
import Header from './Header'
import { formatTime } from '../../utils/formatTime'

class SongSelector extends Component {
  handlePlay = (index) => {
    const { onSongSelect } = this.props

    onSongSelect(index)
  }

  handleMoreSongs = () => {
    const { onFetch, step, maxStep } = this.props

    onFetch(step, maxStep)
  }

  control = (song, cls, index, clickHandler) => {
    const { currentIndex, currentStatus, status } = this.props,
          { title, artist, duration } = song.toObject(),
          nameClass = classNames({
            'active': index == currentIndex && currentStatus !== status.stopped
          }),
          icon = `fa fa-${cls}`

    return (
      <tr key={index} onClick={clickHandler}>
        <td className='is-icon'>
          <a className={nameClass}>
            <i value={index} className={icon} />
          </a>
        </td>
        <td>
          <b>{artist}</b> - <i>{title}</i>
        </td>
        <td className='has-text-right'>
          <span>{formatTime(duration)}</span>
        </td>
      </tr>
    )
  }

  controls = (index, songStatus) => {
    const { currentIndex, status } = this.props

    return {
      play: status.stopped === songStatus,
      pause: index === currentIndex && status.playing === songStatus,
      resume: index === currentIndex && status.paused === songStatus
    }
  }

  renderLoading = () => {
    const { isLoading } = this.props

    if (isLoading) {
      return (
        <div className='loading'>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
    }
  }

  renderWaypoint = () => {
    const { isLoading } = this.props
    let throttledHandler = null

    if (!isLoading) {
      return (
        <tr>
          <td className='is-paddingless'>
            <Waypoint
              onEnter={this.handleMoreSongs.bind()}
              throttleHandler={(scrollHandler) => {
                throttledHandler = throttle(scrollHandler, 300)
                return throttledHandler
              }}
              ref={(component) => {
                if (throttledHandler && !component) {
                  throttledHandler.cancel()
                }
              }}
            />
          </td>
        </tr>
      )
    }
  }

  render() {
    const { onPause, onResume, count, list } = this.props,
          tbody = list.map((song, index) =>
            this.controls(
              index,
              song.get('status')).play && this.control(song, 'play', index, this.handlePlay.bind(this, index)
            ) ||
            this.controls(
              index,
              song.get('status')).pause && this.control(song, 'pause', index, onPause.bind()
            ) ||
            this.controls(
              index,
              song.get('status')).resume && this.control(song, 'play', index, onResume.bind()
            )
          )

    return (
      <section className='songs is-paddingless section'>
        <Header count={count} />
        <div className='track-content'>
          <div className='list'>
            <table className='table is-marginless'>
              <tbody>
                {tbody}
                {this.renderWaypoint()}
              </tbody>
            </table>
            {this.renderLoading()}
          </div>
        </div>
      </section>
    )
  }
}

SongSelector.propTypes = {
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongSelect: T.func.isRequired,
  onFetch: T.func.isRequired,
  count: T.number.isRequired,
  currentIndex: T.number,
  currentStatus: T.string.isRequired,
  step: T.number.isRequired,
  maxStep: T.number.isRequired,
  isLoading: T.bool.isRequired,
  status: T.shape({
    playing: T.string.isRequired,
    paused: T.string.isRequired,
    stopped: T.string.isRequired
  }).isRequired,
  list: I.listOf(
    I.mapContains({
      aid: T.number.isRequired,
      title: T.string.isRequired,
      artist: T.string.isRequired,
      url: T.string.isRequired,
      status: T.string.isRequired,
      duration: T.number.isRequired
    })
  ).isRequired
}

export default SongSelector
