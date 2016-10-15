import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import classNames from 'classnames'
import Header from './Header'
import { formatTime } from '../../utils/formatTime'

class SongSelector extends Component {
  handlePlay = (index) => {
    const { onSkipTo } = this.props

    onSkipTo(index)
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
          <b>{title}</b> - <i>{artist}</i>
        </td>
        <td>
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
              </tbody>
            </table>
          </div>
        </div>
      </section>
    )
  }
}

SongSelector.propTypes = {
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSkipTo: T.func.isRequired,
  count: T.number.isRequired,
  currentIndex: T.number,
  currentStatus: T.string.isRequired,
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
      status: T.string.isRequired
    })
  ).isRequired
}

export default SongSelector
