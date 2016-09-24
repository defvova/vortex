import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import { remote } from 'electron'
import classNames from 'classnames'
import styles from './PlayerControl.scss'
import { formatMilliseconds } from '../../utils/formatMilliseconds'

class PlayerControl extends Component {
  handleSongChange = () => {
    const { list, onSongSelected, songIndex } = this.props,
          index = Math.max(0, songIndex)

    onSongSelected(list.get(index), index)
  }

  control = (nameClass, clickHandler) => {
    const cl = `fa fa-${nameClass}`

    return <a className={styles[nameClass]}><i className={cl} onClick={clickHandler}></i></a>
  }

  handleSongPosition = (e) => {
    const { duration, onSongPosition } = this.props,
          width = remote.getCurrentWindow().getSize()[0],
          position = duration * (e.pageX / width)

    onSongPosition(position)
  }

  handleVolume = (el) => {
    const { onVolume } = this.props,
          target = el.target.getBoundingClientRect(),
          top = target.top,
          height = target.height,
          offset = top + height - window.pageYOffset,
          value = Math.round((offset - el.nativeEvent.clientY))

    onVolume(Math.min(Math.max(value, 0), 100))
  }

  progressBar = (position) => {
    return { width: `${(position / 1) * 100}%` }
  }

  volumeBar = (volume) => {
    return { height: `${volume}%` }
  }

  render() {
    const {
      onPause,
      onResume,
      onStopped,
      onPrev,
      onNext,
      playStatus,
      soundStatuses,
      artist,
      title,
      duration,
      elapsed,
      position,
      bytesLoaded,
      volume,
      onMute,
      mute,
      onShuffle,
      onRepeat
    } = this.props,
          controls = {
            play: playStatus === soundStatuses.STOPPED,
            stop: playStatus !== soundStatuses.STOPPED,
            pause: playStatus === soundStatuses.PLAYING,
            resume: playStatus === soundStatuses.PAUSED
          },
          nameClass = classNames({
            ['volume-up']: !mute && volume > 50,
            ['volume-down']: !mute && volume < 50 && volume > 0,
            ['volume-off']: volume == 0
          })

    return (
      <div className={styles.player}>
        <div className={styles.progress} onClick={this.handleSongPosition.bind(this)}>
          <div className={styles.bar} style={this.progressBar(position)} />
          <div className={styles.loaded} style={this.progressBar(bytesLoaded)} />
        </div>
        <div className={styles.details}>
          <img className={styles.thumb} src='https://i.scdn.co/image/9932849b7e42a167b0e2992435ba3c276d59b37c' />
          <div className={styles.inner}>
            <h2 className={styles.title}>{title}</h2>
            <h4 className={styles.artist}>{artist}</h4>
            <div className={styles.time}>
              <span className={styles.current}>{formatMilliseconds(elapsed)}</span>
              <span>{formatMilliseconds(duration)}</span>
            </div>
          </div>
        </div>
        <div className={styles.controls}>
          { this.control('step-backward', onPrev.bind()) }
          { controls.play && this.control('play', this.handleSongChange.bind()) }
          { controls.stop && this.control('stop', onStopped.bind()) }
          { controls.pause && this.control('pause', onPause.bind()) }
          { controls.resume && this.control('play', onResume.bind()) }
          { this.control('step-forward', onNext.bind()) }
          { this.control('repeat', onRepeat.bind()) }
          { this.control('random', onShuffle.bind()) }
          <div className={styles.volumeContainer}>
            <div className={styles.volume}>
              <div className={styles.track} onClick={this.handleVolume.bind(this)}>
                <div className={styles.bar} style={this.volumeBar(volume)} />
              </div>
            </div>
            { this.control(nameClass, onMute.bind()) }
          </div>
        </div>
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
  onSongPosition: T.func.isRequired,
  onVolume: T.func.isRequired,
  onMute: T.func.isRequired,
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
  count: T.number.isRequired,
  duration: T.number.isRequired,
  elapsed: T.number.isRequired,
  position: T.number.isRequired,
  bytesLoaded: T.number,
  artist: T.string.isRequired,
  title: T.string.isRequired,
  volume: T.number.isRequired,
  mute: T.bool.isRequired,
  shuffle: T.bool.isRequired,
  onShuffle: T.func.isRequired,
  onRepeat: T.func.isRequired
}

export default PlayerControl
