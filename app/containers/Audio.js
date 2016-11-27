import React, { PropTypes as T } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'
import classNames from 'classnames'

import { formatTime } from '../utils/time'
import App from './App'
import { getHowl, muteHowl, howlBytesLoaded } from '../utils/howl'
import Player from '../components/audio/Player'
import LeftPanel from '../components/audio/LeftPanel'
import { STATUS } from '../reducers/player'
import { WATCH_FAVOURITE } from '../sagas/favourite'
import {
  WATCH_UPDATE_LOOP,
  WATCH_UPDATE_SHUFFLE,
  WATCH_PLAY_SONG,
  WATCH_PAUSE_SONG,
  WATCH_NEXT_SONG,
  WATCH_PREV_SONG,
  WATCH_SELECT_SONG,
  WATCH_RESUME_SONG
} from '../sagas/player'

class Audio extends App {
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

    this._bind(
      'loadMoreAudio',
      'play',
      'pause',
      'resume',
      'songSelect',
      'songNext',
      'songPrev',
      'loop',
      'shuffle',
      'mute',
      'volume',
      'seek',
      'step',
      'bytesLoaded',
      'fetchFavourite',
      'renderLoading',
      'controls',
      'row'
    )

    window.Howler.mobileAutoEnable = false
  }

  componentWillMount() {
    process.env.NODE_ENV === 'production' && window.settings.visitor.pageview('/Audio').send()
  }

  get getCurrentStateName() {
    const { routing } = this.props,
          path = routing.locationBeforeTransitions.pathname

    return path.replace(/\//g, '').replace(/^\s*$/, 'favourite')
  }

  get getState() {
    return this.props[this.getCurrentStateName]
  }

  fetchFavourite = () => {
    const { dispatch } = this.props

    dispatch({ type: WATCH_FAVOURITE })
  }

  loadMoreAudio = (step, maxStep) => {
    const { dispatch } = this.props

    if (step > 0 && step !== maxStep) {
      dispatch({ type: WATCH_FAVOURITE, step })
    }
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
    const { player } = this.props,
          prevState = player.get('prevState') || this.getCurrentStateName,
          audio = this.props[prevState]

    this.skipTo(WATCH_NEXT_SONG, null, audio)
  }

  songPrev = () => {
    const { player } = this.props,
          prevState = player.get('prevState') || this.getCurrentStateName,
          audio = this.props[prevState]

    this.skipTo(WATCH_PREV_SONG, null, audio)
  }

  songSelect = (aid) => {
    const audio = this.getState

    this.skipTo(WATCH_SELECT_SONG, aid, audio)
  }

  loop = () => {
    const { player, dispatch } = this.props,
          { isLoop, howlId } = player.toObject()

    dispatch({ type: WATCH_UPDATE_LOOP, howlId, isLoop })
  }

  shuffle = () => {
    const { dispatch } = this.props

    dispatch({ type: WATCH_UPDATE_SHUFFLE })
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
    const { player } = this.props,
          { duration, howlId } = player.toObject(),
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
    const { player } = this.props,
          { duration, howlId } = player.toObject(),
          bytesLoaded = howlBytesLoaded(howlId, duration)

    this.setState({ bytesLoaded })

    if (bytesLoaded <= 100) {
      requestAnimationFrame(this.bytesLoaded)
    }
  }

  seek = (per) => {
    const { player } = this.props,
          { duration, howlId } = player.toObject(),
          howl = getHowl(howlId)

    if (howl && howl.playing()) {
      howl.seek(duration * per)
    }
  }

  renderLoading = (isLoading) => { // eslint-disable-line react/display-name
    if (isLoading) {
      return (
        <div className='loading'>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
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

  row = (song, cls, index, clickHandler) => {
    const { currentAid, currentStatus } = this.props.player.toObject(),
          { title, artist, duration, aid } = song.toObject(),
          nameClass = classNames({
            'active': aid == currentAid && currentStatus !== STATUS.stopped
          }),
          icon = `fa fa-${cls}`

    return (
      <tr key={index} onClick={clickHandler} className={nameClass}>
        <td className='is-icon'>
          <a className={nameClass}>
            <i value={aid} className={icon} />
          </a>
        </td>
        <td>
          <b>{artist}</b> - <i>{title}</i>
        </td>
        <td className='has-text-right'>
          <span>{formatTime(duration)}</span>
        </td>
      </tr>
    )
  }

  render() {
    const { children, player } = this.props,
          { status,
            artist,
            title,
            isLoop,
            isShuffle,
            duration } = player.toObject(),
          { progress,
            elapsed,
            bytesLoaded,
            volume,
            isMute } = this.state,
          body = React.cloneElement(children, {
            audio: this.getState,
            onRenderLoading: this.renderLoading,
            onControls: this.controls,
            onRow: this.row,
            onFetchFavourite: this.fetchFavourite,
            onLoadMoreAudio: this.loadMoreAudio,
            onPause: this.pause,
            onResume: this.resume,
            onSongSelect: this.songSelect,
            onPlay: this.play
          })

    return (
      <section className='section is-paddingless body'>
        <div className='columns is-gapless is-marginless'>
          <div className='column is-one-quarter left-panel'>
            <LeftPanel getCurrentStateName={this.getCurrentStateName} />
          </div>
          <div className='column'>
            {body}
          </div>
        </div>
        <Player
          status={STATUS}
          currentStatus={status}
          volume={volume}
          isMute={isMute}
          progress={progress}
          bytesLoaded={bytesLoaded}
          elapsed={elapsed}
          duration={duration}
          title={title}
          artist={artist}
          isLoop={isLoop}
          isShuffle={isShuffle}
          onSeek={this.seek}
          onVolume={this.volume}
          onMute={this.mute}
          onPause={this.pause}
          onResume={this.resume}
          onShuffle={this.shuffle}
          onSongNext={this.songNext}
          onSongPrev={this.songPrev}
          onLoop={this.loop}
          onPlay={this.play} />
      </section>
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
  const { favourite, player, newsFeed, routing } = state.toObject()

  return { favourite, player, newsFeed, routing }
}

export default connect(mapStateToProps)(Audio)
