import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames'
import styles from './PlayerControl.scss'
import { formatTime } from '../../utils/formatTime'

class PlayerControl extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sliderDown: props.sliderDown
    }

    this.handleVolume = this.handleVolume.bind()
    this.move = this.move.bind()
    this.handleSeek = this.handleSeek.bind()
  }

  componentDidMount() {
    this.refs.move.addEventListener('mousemove', this.move)
    this.refs.move.addEventListener('touchmove', this.move)

    this.refs.move.addEventListener('mousedown', () => {
      this.setState({ sliderDown: true })
    })
    this.refs.move.addEventListener('touchstart', () => {
      this.setState({ sliderDown: true })
    })
    this.refs.move.addEventListener('mouseup', () => {
      this.setState({ sliderDown: false })
    })
    this.refs.move.addEventListener('touchend', () => {
      this.setState({ sliderDown: false })
    })
    this.refs.move.addEventListener('mouseleave', () => {
      this.setState({ sliderDown: false })
    })
  }

  componentWillUnmount() {
    this.refs.move.removeEventListener('mousemove', this.move)
    this.refs.move.removeEventListener('touchmove', this.move)

    this.refs.move.removeEventListener('mousedown', () => {
      this.setState({ sliderDown: true })
    })
    this.refs.move.removeEventListener('touchstart', () => {
      this.setState({ sliderDown: true })
    })
    this.refs.move.removeEventListener('mouseup', () => {
      this.setState({ sliderDown: false })
    })
    this.refs.move.removeEventListener('touchend', () => {
      this.setState({ sliderDown: false })
    })
    this.refs.move.removeEventListener('mouseleave', () => {
      this.setState({ sliderDown: false })
    })
  }

  move = (event) => {
    const { sliderDown } = this.state

    if (sliderDown) {
      this.handleVolume(event)
    }
  }

  control = (nameClass, clickHandler) => {
    const cl = `fa fa-${nameClass}`

    return <a className={styles[nameClass]}><i className={cl} onClick={clickHandler} /></a>
  }

  handleVolume = (event) => {
    const { onVolume } = this.props,
          target = event.target.getBoundingClientRect(),
          top = target.top,
          height = target.height,
          offset = top + height,
          clientY = event.nativeEvent ? event.nativeEvent.clientY : event.clientY,
          value = Math.round((offset - clientY)) / 100

    onVolume(Math.min(Math.max(value, 0), 1))
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
      onStop,
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
      title
    } = this.props,
          controls = {
            play: status.stopped === currentStatus,
            stop: status.stopped !== currentStatus,
            pause: status.playing === currentStatus,
            resume: status.paused === currentStatus
          },
          nameClass = classNames({
            ['volume-up']: !isMute && volume > 0.5,
            ['volume-down']: !isMute && volume <= 0.5 && volume > 0.0,
            ['volume-off']: volume == 0.0
          })

    return (
      <div className={styles.player}>
        <div className={styles.progress} onClick={this.handleSeek}>
          <div className={styles.bar} style={this.progressBar(progress)} />
          <div className={styles.loaded} style={this.progressBar(bytesLoaded)} />
        </div>
        <div className={styles.details}>
          <img className={styles.thumb} src='https://i.scdn.co/image/9932849b7e42a167b0e2992435ba3c276d59b37c' />
          <div className={styles.inner}>
            <div className={styles.time}>
              <h2 className={styles.title}>{title}</h2>
              <h4 className={styles.artist}>{artist}</h4>
              <span className={styles.current}>{formatTime(elapsed)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        <div className={styles.controls}>
          { this.control('step-backward', onSongPrev.bind()) }
          { controls.play && this.control('play', onPlay.bind()) }
          { controls.stop && this.control('stop', onStop.bind()) }
          { controls.pause && this.control('pause', onPause.bind()) }
          { controls.resume && this.control('play', onResume.bind()) }
          { this.control('step-forward', onSongNext.bind()) }
          { this.control('repeat', onLoop.bind()) }
          { this.control('random', onShuffle.bind()) }
          <div className={styles.volumeContainer}>
            <div className={styles.volume}>
              <div className={styles.track} ref='move' onClick={this.handleVolume}>
                <div className={styles.bar} style={this.volumeBar()} />
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
  onPlay: T.func.isRequired,
  onStop: T.func.isRequired,
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
  bytesLoaded: T.number.isRequired
}

PlayerControl.defaultProps = {
  sliderDown: false
}

export default PlayerControl
