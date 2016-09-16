import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'

class SongSelector extends Component {
  handleSongChange = (el) => {
    const { list, onSongSelected } = this.props,
          index = el.target.getAttribute('value')

    onSongSelected(list.get(index), parseInt(index))
  }

  control = (title, index, clickHandler) => {
    return <a value={index} onClick={clickHandler}>{title}</a>
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
      <div>
        <h4>Found {count} recordings</h4>
        <ul>
        {list.map((song, index) =>
          <li key={index}>
            { this.controls(song.get('aid')).play &&
              this.control(song.get('title'), index, this.handleSongChange.bind(this)) }
            { this.controls(song.get('aid')).pause && this.control(song.get('title'), index, onPause.bind()) }
            { this.controls(song.get('aid')).resume && this.control(song.get('title'), index, onResume.bind()) }
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
