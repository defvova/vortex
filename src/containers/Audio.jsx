import React, { PropTypes as T, createElement as el } from 'react'
import I from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { fromJS } from 'immutable'

import formatTime from '../utils/formatTime'
import renderIf from '../utils/renderif'
import { getHowl, muteHowl, howlBytesLoaded } from '../utils/howl'
import isObjectEqual from '../utils/isObjectEqual'
import Player from '../components/audio/Player.jsx'
import LeftPanel from '../components/audio/LeftPanel.jsx'
import {
  WATCH_UPDATE_LOOP,
  WATCH_UPDATE_SHUFFLE,
  WATCH_PLAY_SONG,
  WATCH_PAUSE_SONG,
  WATCH_NEXT_SONG,
  WATCH_PREV_SONG,
  WATCH_SELECT_SONG,
  WATCH_RESUME_SONG,
  STATUS
} from '../constants'

class Audio extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      progress: props.progress,
      elapsed: props.elapsed,
      bytesLoaded: props.bytesLoaded,
      volume: props.volume,
      prevVolume: props.prevVolume,
      isMute: props.isMute
    }

    window.Howler.mobileAutoEnable = false
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    if (!isObjectEqual(this.state, nextState)) {
      return true
    }

    return false
  }

  get getCurrentStateName() {
    const path = this.props.location.pathname

    return path.replace(/\//g, '').replace(/^\s*$/, 'favourite')
  }

  get getState() {
    return this.props[this.getCurrentStateName]
  }

  play = (aid) => {
    const { dispatch, player } = this.props,
          audio = this.getState,
          status = STATUS.playing,
          currentStateName = this.getCurrentStateName

    dispatch({
      type: WATCH_PLAY_SONG,
      audio,
      player,
      currAid: aid,
      status,
      currentStateName,
      onStep: this.step,
      onBytesLoaded: this.bytesLoaded,
      onSongNext: this.songNext
    })
  }

  toggleControl = (status, type) => {
    const { dispatch, player } = this.props,
          { howlId, currentAid } = player.toObject(),
          currentStateName = this.getCurrentStateName

    dispatch({ type, status, howlId, currentStateName, aid: currentAid })
  }

  pause = () => {
    this.toggleControl(STATUS.paused, WATCH_PAUSE_SONG)
  }

  resume = () => {
    this.toggleControl(STATUS.playing, WATCH_RESUME_SONG)
  }

  skipTo = (type, aid, audio) => {
    const { player, dispatch } = this.props,
          status = STATUS.playing,
          currentStateName = this.getCurrentStateName

    dispatch({
      type,
      audio,
      player,
      status,
      aid,
      currentStateName,
      onStep: this.step,
      onBytesLoaded: this.bytesLoaded,
      onSongNext: this.songNext
    })
  }

  songNext = () => {
    const prevState = this.props.player.get('prevState') || this.getCurrentStateName

    this.skipTo(WATCH_NEXT_SONG, null, this.props[prevState])
  }

  songPrev = () => {
    const prevState = this.props.player.get('prevState') || this.getCurrentStateName

    this.skipTo(WATCH_PREV_SONG, null, this.props[prevState])
  }

  songSelect = (aid) => {
    this.skipTo(WATCH_SELECT_SONG, aid, this.getState)
  }

  loop = () => {
    const { player, dispatch } = this.props,
          { isLoop, howlId } = player.toObject()

    dispatch({ type: WATCH_UPDATE_LOOP, howlId, isLoop })
  }

  shuffle = () => {
    this.props.dispatch({ type: WATCH_UPDATE_SHUFFLE })
  }

  mute = () => {
    const { isMute, volume, prevVolume } = this.state,
          params = muteHowl({ volume, prevVolume, isMute })

    this.setState({ isMute: !isMute, ...params })
  }

  volume = (volume) => {
    const isMute = false

    this.setState({ volume, isMute })

    window.Howler.mute(isMute)
    window.Howler.volume(volume / 100)
  }

  step = () => {
    const { duration, howlId } = this.props.player.toObject(),
          howl = getHowl(howlId),
          seek = howl.seek(),
          progress = (seek / duration) * 100,
          elapsed = Math.round(seek)

    this.setState({ progress, elapsed })

    if (howl && howl.playing()) {
      requestAnimationFrame(this.step)
    }
  }

  bytesLoaded = () => {
    const { duration, howlId } = this.props.player.toObject(),
          bytesLoaded = howlBytesLoaded(howlId, duration)

    this.setState({ bytesLoaded })

    if (bytesLoaded <= 100) {
      requestAnimationFrame(this.bytesLoaded)
    }
  }

  seek = (per) => {
    const { duration, howlId } = this.props.player.toObject(),
          howl = getHowl(howlId)

    if (howl && howl.playing()) {
      howl.seek(duration * per)
    }
  }

  controls = (aid, songStatus) => {
    const currentAid = this.props.player.get('currentAid')

    return {
      play: STATUS.stopped === songStatus,
      pause: aid === currentAid && STATUS.playing === songStatus,
      resume: aid === currentAid && STATUS.paused === songStatus
    }
  }

  render() {
    const body = React.cloneElement(this.props.children, {
      onControls: this.controls,
      onPause: this.pause,
      onResume: this.resume,
      onSongSelect: this.songSelect,
      onPlay: this.play
    })

    return (
      el('section', { className: 'section is-paddingless body' },
        el('div', { className: 'columns is-gapless is-marginless' },
          el('div', { className: 'column is-one-quarter left-panel' },
            el(LeftPanel, { getCurrentStateName: this.getCurrentStateName })
          ),
          el('div', { className: 'column' }, body)
        ),
        el(Player, {
          ...this.state,
          onSeek: this.seek,
          onVolume: this.volume,
          onMute: this.mute,
          onPause: this.pause,
          onResume: this.resume,
          onShuffle: this.shuffle,
          onSongNext: this.songNext,
          onSongPrev: this.songPrev,
          onLoop: this.loop,
          onPlay: this.play
        })
      )
    )
  }
}

Audio.propTypes = {
  dispatch: T.func.isRequired,
  favourite: I.mapContains({
    list: I.listOf(
      I.mapContains({
        aid: T.number.isRequired,
        title: T.string.isRequired,
        artist: T.string.isRequired,
        url: T.string.isRequired,
        status: T.string.isRequired,
        duration: T.number.isRequired,
        howlId: T.number
      })
    ).isRequired,
    count: T.number.isRequired,
    offset: T.number.isRequired,
    step: T.number.isRequired,
    maxStep: T.number.isRequired,
    isLoading: T.bool.isRequired,
    error: T.string
  }).isRequired,
  player: I.mapContains({
    howlId: T.number,
    currentAid: T.number,
    duration: T.number.isRequired,
    status: T.string.isRequired,
    isLoop: T.bool.isRequired,
    isShuffle: T.bool.isRequired,
    title: T.string.isRequired,
    artist: T.string.isRequired
  }).isRequired,
  progress: T.number.isRequired,
  elapsed: T.number.isRequired,
  bytesLoaded: T.number.isRequired,
  volume: T.number.isRequired,
  prevVolume: T.number.isRequired,
  isMute: T.bool.isRequired
}

Audio.defaultProps = {
  progress: 0,
  elapsed: 0,
  bytesLoaded: 0,
  volume: 100,
  prevVolume: 100,
  isMute: false
}

function mapStateToProps(state) {
  return {
    favourite: state.get('favourite'),
    player: state.get('player'),
    newsFeed: state.get('newsFeed')
  }
}

export default connect(mapStateToProps)(Audio)
