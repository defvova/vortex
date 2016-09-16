import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'

class PlayerControl extends Component {
  handleSongChange = () => {
    const { list, onSongSelected, songIndex } = this.props,
          index = Math.max(0, songIndex)

    onSongSelected(list.get(index), index)
  }

  handleSongNext = () => {
    const { onNext, list, count } = this.props
    let { songIndex } = this.props

    songIndex += 1
    const index = Math.min(count, songIndex) // eslint-disable-line one-var

    onNext(list.get(index), count, index)
  }

  handleSongPrev = () => {
    const { onPrev, list } = this.props
    let { songIndex } = this.props

    songIndex -= 1
    const index = Math.max(0, songIndex) // eslint-disable-line one-var

    onPrev(list.get(index), index)
  }

  control = (text, clickHandler) => {
    return <a onClick={clickHandler}>{text} </a>
  }

  render() {
    const {
      onPause,
      onResume,
      onStopped,
      playStatus,
      soundStatuses
    } = this.props,
          controls = {
            play: playStatus === soundStatuses.STOPPED,
            stop: playStatus !== soundStatuses.STOPPED,
            pause: playStatus === soundStatuses.PLAYING,
            resume: playStatus === soundStatuses.PAUSED
          }

    return (
      <div>
        <br />
        <div>==============================</div>
        { this.control('Prev', this.handleSongPrev.bind()) }
        { controls.play && this.control('Play', this.handleSongChange.bind()) }
        { controls.stop && this.control('Stop', onStopped.bind()) }
        { controls.pause && this.control('Pause', onPause.bind()) }
        { controls.resume && this.control('Resume', onResume.bind()) }
        { this.control('Next', this.handleSongNext.bind()) }
        <div>==============================</div>
      </div>
    )
  }
}

PlayerControl.propTypes = {
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onStopped: T.func.isRequired,
  onNext: T.func.isRequired,
  onPrev: T.func.isRequired,
  onSongSelected: T.func.isRequired,
  list: I.listOf(
    I.mapContains({
      aid: T.number.isRequired,
      url: T.string.isRequired
    })
  ),
  playStatus: T.oneOf(['PLAYING', 'PAUSED', 'STOPPED']).isRequired,
  soundStatuses: T.shape({
    PLAYING: T.string.isRequired,
    PAUSED: T.string.isRequired,
    STOPPED: T.string.isRequired
  }).isRequired,
  songIndex: T.number.isRequired,
  count: T.number.isRequired
}

export default PlayerControl
