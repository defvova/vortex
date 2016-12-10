import React, { Component, PropTypes as T, createElement as el } from 'react'
import I from 'react-immutable-proptypes'
import classNames from 'classnames'
import { connect } from 'react-redux'
import formatTime from '../../utils/formatTime'
import isObjectEqual from '../../utils/isObjectEqual'
import { STATUS } from '../../constants'
import { fromJS } from 'immutable'

class Player extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  control = (className, clickHandler) => {
    return (
      el('span', { className: 'icon is-small' },
        el('a', { className },
          el('i', { className: `fa fa-${className} ${className}`, onClick: clickHandler })
        )
      )
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
    const { status, artist, title, isLoop, isShuffle, duration } = this.props.player.toObject(),
          { onPlay,
            onSongNext,
            onSongPrev,
            onPause,
            onResume,
            onLoop,
            onShuffle,
            onMute,
            volume,
            isMute,
            elapsed,
            progress,
            bytesLoaded
          } = this.props,
          controls = {
            play: STATUS.stopped === status,
            pause: STATUS.playing === status,
            resume: STATUS.paused === status
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
      el('div', { className: 'player columns is-multiline is-gapless' },
        el('div', { className: 'progress column is-12', onClick: this.handleSeek },
          el('div', { className: 'bar', style: this.progressBar(progress) }),
          el('div', { className: 'loaded', style: this.progressBar(bytesLoaded) })
        ),
        el('div', { className: 'column is-one-quarter has-text-centered controls' },
          this.control('step-backward', onSongPrev.bind()),
          controls.play && this.control('play', onPlay.bind(this, null)),
          controls.pause && this.control('pause', onPause.bind()),
          controls.resume && this.control('play', onResume.bind()),
          this.control('step-forward', onSongNext.bind())
        ),
        el('div', { className: 'column is-6' },
          el('div', { className: 'details' },
            el('b', {}, artist), ' - ', el('i', {}, title)
          )
        ),
        el('div', { className: 'column has-text-right' },
          el('div', { className: 'actions' },
            el('div', {}, this.control('headphones', onLoop.bind())),
            el('div', { className: loopActive }, this.control('repeat', onLoop.bind())),
            el('div', { className: shuffleActive }, this.control('random', onShuffle.bind())),
            el('div', { className: 'volume' },
              this.control(volumeClasses, onMute.bind()),
              el('div', { className: 'popover' },
                el('input', {
                  className: 'range',
                  value: volume,
                  type: 'range',
                  min: '0',
                  max: '100',
                  step: '1',
                  onChange: this.handleVolume
                })
              )
            ),
            el('div', {},
              el('span', { className: 'durations' }, formatTime(elapsed), ' / ', formatTime(duration))
            )
          )
        )
      )
    )
  }
}

Player.propTypes = {
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
  volume: T.number.isRequired,
  isMute: T.bool.isRequired,
  elapsed: T.number.isRequired,
  progress: T.number.isRequired,
  bytesLoaded: T.number.isRequired,
  player: I.mapContains({
    howlId: T.number,
    currentAid: T.number,
    duration: T.number.isRequired,
    status: T.string.isRequired,
    isLoop: T.bool.isRequired,
    isShuffle: T.bool.isRequired,
    title: T.string.isRequired,
    artist: T.string.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {
    player: state.get('player')
  }
}

export default connect(mapStateToProps)(Player)
