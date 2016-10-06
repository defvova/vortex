import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import styles from './SongSelector.scss'
import classNames from 'classnames'

class SongSelector extends Component {
  constructor(props) {
    super(props)

    this.handlePlay = this.handlePlay.bind()
  }

  handlePlay = (el) => {
    const { onSkipTo } = this.props,
          index = parseInt(el.target.getAttribute('value'))

    onSkipTo(index)
  }

  control = (song, cls, index, clickHandler) => {
    const { currentIndex, currentStatus, status } = this.props,
          { title, artist } = song.toObject(),
          nameClass = classNames({
            [styles.active]: index == currentIndex && currentStatus !== status.stopped
          }),
          icon = `fa fa-${cls}`

    return (
      <div className={styles.inner}>
        <a className={nameClass} onClick={clickHandler}><i value={index} className={icon} /></a>
        <div className={styles.details}>
          <div>{title}</div>
          <div>{artist}</div>
        </div>
      </div>
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
    const { onPause, onResume, count, list } = this.props

    return (
      <div className={styles.list}>
        <h4>Found {count} recordings</h4>
        <ul>
        {list.map((song, index) =>
          <li key={index}>
            { this.controls(index, song.get('status')).play &&
              this.control(song, 'play', index, this.handlePlay) }
            { this.controls(index, song.get('status')).pause &&
              this.control(song, 'pause', index, onPause.bind()) }
            { this.controls(index, song.get('status')).resume &&
              this.control(song, 'play', index, onResume.bind()) }
          </li>
        )}
        </ul>
      </div>
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
