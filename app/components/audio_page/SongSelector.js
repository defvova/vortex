import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import styles from './SongSelector.scss'
import classNames from 'classnames'

class SongSelector extends Component {
  handleSongChange = (el) => {
    const { list, onSongSelected } = this.props,
          index = el.target.getAttribute('value')

    onSongSelected(list.get(index), parseInt(index))
  }

  control = (song, cls, index, clickHandler) => {
    const { currentAid } = this.props,
          title = song.get('title'),
          aid = song.get('aid'),
          artist = song.get('artist'),
          nameClass = classNames({
            [styles.active]: aid == currentAid
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

  controls = (aid) => {
    const { playStatus, soundStatuses, currentAid } = this.props

    return {
      play: aid !== currentAid,
      pause: aid === currentAid && playStatus === soundStatuses.PLAYING,
      resume: aid === currentAid && playStatus === soundStatuses.PAUSED
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
            { this.controls(song.get('aid')).play &&
              this.control(song, 'play', index, this.handleSongChange.bind(this)) }
            { this.controls(song.get('aid')).pause &&
              this.control(song, 'pause', index, onPause.bind()) }
            { this.controls(song.get('aid')).resume &&
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
  onSongSelected: T.func.isRequired,
  count: T.number.isRequired,
  list: I.listOf(
    I.mapContains({
      aid: T.number.isRequired,
      title: T.string.isRequired
    })
  ),
  playStatus: T.oneOf(['PLAYING', 'PAUSED', 'STOPPED']).isRequired,
  soundStatuses: T.shape({
    PLAYING: T.string.isRequired,
    PAUSED: T.string.isRequired,
    STOPPED: T.string.isRequired
  }).isRequired,
  currentAid: T.number
}

export default SongSelector
