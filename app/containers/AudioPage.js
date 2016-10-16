import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'
import { Howl } from 'howler/dist/howler.min'

import SongSelector from '../components/audio_page/SongSelector'
import PlayerControl from '../components/audio_page/PlayerControl'
import LeftPanel from '../components/audio_page/LeftPanel'
import {
  fetchAudios,
  updateStatus,
  updateLoop,
  updateShuffle,
  STATUS
} from '../actions/audio'

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

    this.howles = []
    this.fetch = this.fetch.bind()
    this.play = this.play.bind()
    this.pause = this.pause.bind()
    this.resume = this.resume.bind()
    this.stop = this.stop.bind()
    this.skipTo = this.skipTo.bind()
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
    const { dispatch } = this.props

    process.env.NODE_ENV === 'production' && window.settings.visitor.pageview('/AudioPage').send()

    dispatch(fetchAudios())
  }

  fetch = (step, maxStep) => {
    const { dispatch } = this.props

    if (step > 0 && step !== maxStep) {
      dispatch(fetchAudios(step))
    }
  }

  play = (index) => {
    const { audio, dispatch } = this.props,
          { currentIndex, isLoop } = audio.toObject(),
          i = typeof index === 'number' ? index : currentIndex,
          url = audio.getIn(['list', i, 'url'])

    let howl = null

    if (this.howles[i]) {
      howl = this.howles[i]
    } else {
      howl = new Howl({
        src: url,
        html5: true,
        loop: isLoop,
        onplay: () => {
          requestAnimationFrame(this.step)
          requestAnimationFrame(this.bytesLoaded)
          howl.loop(isLoop)
        },
        onseek: () => {
          requestAnimationFrame(this.bytesLoaded)
        },
        onend: () => {
          if (!howl.loop()) {
            this.songNext()
          }
        }
      })
      this.howles[i] = howl
    }

    howl.play()

    dispatch(updateStatus(i, STATUS.playing))
  }

  pause = () => {
    const { audio, dispatch } = this.props,
          index = audio.get('currentIndex'),
          howl = this.howles[index]

    howl.pause()
    dispatch(updateStatus(index, STATUS.paused))
  }

  resume = () => {
    const { audio, dispatch } = this.props,
          index = audio.get('currentIndex'),
          howl = this.howles[index]

    howl.play()
    dispatch(updateStatus(index, STATUS.playing))
  }

  stop = () => {
    const { audio, dispatch } = this.props,
          index = audio.get('currentIndex'),
          howl = this.howles[index]

    if (howl) {
      howl.stop()
      dispatch(updateStatus(index, STATUS.stopped))
    }
  }

  songNext = () => {
    const { audio } = this.props,
          { list, isShuffle, count, currentIndex } = audio.toObject()

    let i = currentIndex,
        index = null

    if (isShuffle) {
      index = Math.floor(Math.random() * list.size)
    } else {
      i += 1
      index = Math.min(count, i)
    }

    this.skipTo(index)
  }

  songPrev = () => {
    const { audio } = this.props,
          { list, isShuffle, currentIndex } = audio.toObject()

    let i = currentIndex,
        index = null

    if (isShuffle) {
      index = Math.floor(Math.random() * list.size)
    } else {
      i -= 1
      index = Math.max(0, i)
    }

    this.skipTo(index)
  }

  skipTo = (index) => {
    this.stop()
    this.play(index)
  }

  loop = () => {
    const { audio, dispatch } = this.props,
          index = audio.get('currentIndex'),
          isLoop = audio.get('isLoop'),
          howl = this.howles[index]

    if (howl) {
      howl.loop(!isLoop)
    }

    dispatch(updateLoop())
  }

  shuffle = () => {
    const { dispatch } = this.props

    dispatch(updateShuffle())
  }

  mute = () => {
    const { isMute, volume, prevVolume } = this.state

    let vol = null,
        prevVol = null

    window.Howler.mute(!isMute)

    if (isMute) {
      vol = prevVolume
      prevVol = prevVolume
    } else {
      vol = 0
      prevVol = volume
    }

    this.setState({ isMute: !isMute, volume: vol, prevVolume: prevVol })
  }

  volume = (volume) => {
    const isMute = false

    this.setState({ volume, isMute })

    window.Howler.mute(isMute)
    window.Howler.volume(volume / 100)
  }

  step = () => {
    const { audio } = this.props,
          { currentIndex, duration } = audio.toObject(),
          howl = this.howles[currentIndex],
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
          { currentIndex, duration } = audio.toObject(),
          howl = this.howles[currentIndex],
          sound = howl._sounds[0]._node,
          buffered = sound.buffered,
          time = sound.currentTime,
          seek = howl.seek()

    let range = 0

    while (buffered.length > range + 1 && !(buffered.start(range) <= time && time <= buffered.end(range))) {
      range += 1
    }

    const loadStartPercentage = buffered.length != 0 && buffered.start(range) / duration, // eslint-disable-line one-var
          loadEndPercentage = buffered.length != 0 && buffered.end(range) / duration,
          loaded = loadEndPercentage - loadStartPercentage,
          bytesLoaded = (loaded + (seek / duration)) * 100

    this.setState({ bytesLoaded })

    if (bytesLoaded <= 100) {
      requestAnimationFrame(this.bytesLoaded)
    }
  }

  seek = (per) => {
    const { audio } = this.props,
          { currentIndex, duration } = audio.toObject(),
          howl = this.howles[currentIndex]

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
          <div className='column is-one-quarter left-panel '>
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
              onSkipTo={this.skipTo} />
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
        duration: T.number.isRequired
      })
    ).isRequired,
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
    artist: T.string.isRequired
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
