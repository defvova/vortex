import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames'
import { formatTime } from '../../utils/formatTime'

class PlayerControl extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sliderDown: props.sliderDown
    }

    this.handleVolume = this.handleVolume.bind()
    this.handleSeek = this.handleSeek.bind()
  }

  control = (nameClass, clickHandler) => {
    const cl = `fa fa-${nameClass} ${nameClass}`

    return (
      <span className='icon is-small'>
        <a className={nameClass}>
          <i className={cl} onClick={clickHandler} />
        </a>
      </span>
    )
  }

  handleVolume = (event) => {
    const { onVolume } = this.props,
          value = event.target.value

    onVolume(parseInt(value))
  }

  handleSeek = (event) => {
    const { onSeek } = this.props,
          clientX = event.nativeEvent.clientX,
          innerWidth = window.innerWidth

    onSeek(clientX / innerWidth)
  }

  progressBar = (progress) => {
    return { width: `${progress}%` }
  }

  volumeBar = () => {
    const { volume } = this.props

    return { height: `${volume * 100}%` }
  }

  render() {
    const {
      onPlay,
      onSongNext,
      onSongPrev,
      onPause,
      onResume,
      onLoop,
      onShuffle,
      onMute,
      status,
      currentStatus,
      volume,
      isMute,
      elapsed,
      duration,
      progress,
      bytesLoaded,
      artist,
      title,
      isLoop,
      isShuffle
    } = this.props,
          controls = {
            play: status.stopped === currentStatus,
            pause: status.playing === currentStatus,
            resume: status.paused === currentStatus
          },
          volumeClasses = classNames({
            'volume-up': !isMute && volume > 50,
            'volume-down': !isMute && volume <= 50 && volume > 0,
            'volume-off': volume == 0
          }),
          loopActive = classNames({
            'loop-active': isLoop
          }),
          shuffleActive = classNames({
            'shuffle-active': isShuffle
          })

    return (
      <div className='player columns is-multiline is-gapless'>
        <div className='progress column is-12' onClick={this.handleSeek}>
          <div className='bar' style={this.progressBar(progress)} />
          <div className='loaded' style={this.progressBar(bytesLoaded)} />
        </div>
        <div className='column is-one-quarter has-text-centered controls'>
          { this.control('step-backward', onSongPrev.bind()) }
          { controls.play && this.control('play', onPlay.bind()) }
          { controls.pause && this.control('pause', onPause.bind()) }
          { controls.resume && this.control('play', onResume.bind()) }
          { this.control('step-forward', onSongNext.bind()) }
        </div>
        <div className='column is-6'>
          <div className='details'>
            <b>{artist}</b> - <i>{title}</i>
          </div>
        </div>
        <div className='column has-text-right'>
          <div className='actions'>
            <div>{ this.control('headphones', onLoop.bind())}</div>
            <div className={loopActive}>{ this.control('repeat', onLoop.bind()) }</div>
            <div className={shuffleActive}>{ this.control('random', onShuffle.bind()) }</div>
            <div className='volume'>
              { this.control(volumeClasses, onMute.bind()) }
              <div className='popover'>
                <input
                  className='range'
                  value={volume}
                  type='range'
                  min='0'
                  max='100'
                  step='1'
                  onChange={this.handleVolume} />
              </div>
            </div>
            <div><span className='durations'>{formatTime(elapsed)} / {formatTime(duration)}</span></div>
          </div>
        </div>
      </div>
    )
  }
}

PlayerControl.propTypes = {
  onPlay: T.func.isRequired,
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongNext: T.func.isRequired,
  onSongPrev: T.func.isRequired,
  onLoop: T.func.isRequired,
  onShuffle: T.func.isRequired,
  onMute: T.func.isRequired,
  onVolume: T.func.isRequired,
  onSeek: T.func.isRequired,
  status: T.shape({
    playing: T.string.isRequired,
    paused: T.string.isRequired,
    stopped: T.string.isRequired
  }).isRequired,
  volume: T.number.isRequired,
  isMute: T.bool.isRequired,
  currentStatus: T.string.isRequired,
  currentIndex: T.number.isRequired,
  sliderDown: T.bool.isRequired,
  artist: T.string.isRequired,
  title: T.string.isRequired,
  elapsed: T.number.isRequired,
  duration: T.number.isRequired,
  progress: T.number.isRequired,
  bytesLoaded: T.number.isRequired,
  isShuffle: T.bool.isRequired,
  isLoop: T.bool.isRequired
}

PlayerControl.defaultProps = {
  sliderDown: false
}

export default PlayerControl
