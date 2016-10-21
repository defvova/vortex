import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'

import { getHowl, muteHowl, howlBytesLoaded } from '../utils/howl'
import SongSelector from '../components/audio_page/SongSelector'
import PlayerControl from '../components/audio_page/PlayerControl'
import LeftPanel from '../components/audio_page/LeftPanel'
import { STATUS } from '../reducers/audio'
import {
  WATCH_LOAD_MORE,
  WATCH_UPDATE_LOOP,
  WATCH_UPDATE_SHUFFLE,
  WATCH_PLAY_SONG,
  WATCH_PAUSE_SONG,
  WATCH_NEXT_SONG,
  WATCH_PREV_SONG,
  WATCH_SELECT_SONG,
  WATCH_RESUME_SONG
} from '../sagas/audio'

class AudioPage extends Component {
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

    this.fetch = this.fetch.bind()
    this.play = this.play.bind()
    this.pause = this.pause.bind()
    this.resume = this.resume.bind()
    this.songSelect = this.songSelect.bind()
    this.songNext = this.songNext.bind()
    this.songPrev = this.songPrev.bind()
    this.loop = this.loop.bind()
    this.shuffle = this.shuffle.bind()
    this.mute = this.mute.bind()
    this.volume = this.volume.bind()
    this.seek = this.seek.bind()
    this.step = this.step.bind()
    this.bytesLoaded = this.bytesLoaded.bind()

    window.Howler.mobileAutoEnable = false
  }

  componentWillMount() {
    process.env.NODE_ENV === 'production' && window.settings.visitor.pageview('/AudioPage').send()
  }

  fetch = (step, maxStep) => {
    const { dispatch } = this.props

    if (step > 0 && step !== maxStep) {
      dispatch({ type: WATCH_LOAD_MORE, step })
    }
  }

  play = (index) => {
    const { audio, dispatch } = this.props,
          { currentIndex, isLoop } = audio.toObject(),
          i = typeof index === 'number' ? index : currentIndex,
          url = audio.getIn(['list', i, 'url'])

    dispatch({
      type: WATCH_PLAY_SONG,
      index: i,
      status: STATUS.playing,
      url,
      isLoop,
      onStep: this.step,
      onBytesLoaded: this.bytesLoaded,
      onSongNext: this.songNext
    })
  }

  pause = () => {
    const { audio, dispatch } = this.props,
          { currentIndex, howlId } = audio.toObject(),
          status = STATUS.paused

    dispatch({ type: WATCH_PAUSE_SONG, index: currentIndex, status, howlId })
  }

  resume = () => {
    const { audio, dispatch } = this.props,
          { currentIndex, howlId } = audio.toObject(),
          status = STATUS.playing

    dispatch({ type: WATCH_RESUME_SONG, index: currentIndex, status, howlId })
  }

  skipTo = (type, index = null) => {
    const { audio, dispatch } = this.props

    dispatch({
      type,
      index,
      audio,
      onStep: this.step,
      onBytesLoaded: this.bytesLoaded,
      onSongNext: this.songNext
    })
  }

  songNext = () => {
    this.skipTo(WATCH_NEXT_SONG)
  }

  songPrev = () => {
    this.skipTo(WATCH_PREV_SONG)
  }

  songSelect = (index) => {
    this.skipTo(WATCH_SELECT_SONG, index)
  }

  loop = () => {
    const { audio, dispatch } = this.props,
          { isLoop, howlId } = audio.toObject()

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
    const { audio } = this.props,
          { duration, howlId } = audio.toObject(),
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
    const { audio } = this.props,
          { duration, howlId } = audio.toObject(),
          bytesLoaded = howlBytesLoaded(howlId, duration)

    this.setState({ bytesLoaded })

    if (bytesLoaded <= 100) {
      requestAnimationFrame(this.bytesLoaded)
    }
  }

  seek = (per) => {
    const { audio } = this.props,
          { duration, howlId } = audio.toObject(),
          howl = getHowl(howlId)

    if (howl && howl.playing()) {
      howl.seek(duration * per)
    }
  }

  render() {
    const { audio } = this.props,
          { count,
            list,
            currentIndex,
            status,
            artist,
            title,
            isLoading,
            isLoop,
            isShuffle,
            step,
            maxStep,
            duration } = audio.toObject(),
          { progress,
            elapsed,
            bytesLoaded,
            volume,
            isMute } = this.state

    return (
      <section className='section is-paddingless body'>
        <div className='columns is-gapless is-marginless'>
          <div className='column is-one-quarter left-panel'>
            <LeftPanel />
          </div>
          <div className='column'>
            <SongSelector
              count={count}
              list={list}
              currentIndex={currentIndex}
              currentStatus={status}
              status={STATUS}
              isLoading={isLoading}
              step={step}
              maxStep={maxStep}
              onFetch={this.fetch}
              onPause={this.pause}
              onResume={this.resume}
              onSongSelect={this.songSelect} />
          </div>
        </div>
        <PlayerControl
          status={STATUS}
          currentStatus={status}
          currentIndex={currentIndex}
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

AudioPage.propTypes = {
  dispatch: T.func.isRequired,
  audio: I.mapContains({
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
    howlId: T.number,
    count: T.number.isRequired,
    offset: T.number.isRequired,
    step: T.number.isRequired,
    maxStep: T.number.isRequired,
    isLoading: T.bool.isRequired,
    currentIndex: T.number.isRequired,
    duration: T.number.isRequired,
    status: T.string.isRequired,
    isLoop: T.bool.isRequired,
    isShuffle: T.bool.isRequired,
    title: T.string.isRequired,
    artist: T.string.isRequired,
    error: T.string
  }).isRequired,
  progress: T.number.isRequired,
  elapsed: T.number.isRequired,
  bytesLoaded: T.number.isRequired,
  volume: T.number.isRequired,
  prevVolume: T.number.isRequired,
  isMute: T.bool.isRequired
}

AudioPage.defaultProps = {
  progress: 0,
  elapsed: 0,
  bytesLoaded: 0,
  volume: 100,
  prevVolume: 100,
  isMute: false
}

function mapStateToProps(state) {
  const { audio } = state.toObject()

  return { audio }
}

export default connect(mapStateToProps)(AudioPage)
