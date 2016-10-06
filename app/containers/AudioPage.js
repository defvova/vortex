import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'
import { Howl } from 'howler/dist/howler.min'

import SongSelector from '../components/audio_page/SongSelector'
import PlayerControl from '../components/audio_page/PlayerControl'
import {
  fetchAudios,
  updateStatus,
  updateLoop,
  updateShuffle,
  updateVolume,
  updateMute,
  STATUS
} from '../actions/audio'

class AudioPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      progress: props.progress,
      elapsed: props.elapsed,
      duration: props.duration,
      bytesLoaded: props.bytesLoaded
    }

    this.howles = window.Howler._howls
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
          this.setState({ duration: Math.round(howl.duration()) })
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
    const { audio, dispatch } = this.props,
          { isMute, volume, prevVolume } = audio.toObject()

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

    dispatch(updateMute(vol, prevVol))
  }

  volume = (volume) => {
    const { dispatch } = this.props,
          isMute = false

    window.Howler.mute(isMute)
    window.Howler.volume(volume)

    dispatch(updateVolume(volume, isMute))
  }

  step = () => {
    const { audio } = this.props,
          index = audio.get('currentIndex'),
          howl = this.howles[index],
          seek = howl.seek(),
          progress = (seek / howl.duration()) * 100,
          elapsed = Math.round(seek)

    this.setState({ progress, elapsed })

    if (howl && howl.playing()) {
      requestAnimationFrame(this.step)
    }
  }

  bytesLoaded = () => {
    const { audio } = this.props,
          index = audio.get('currentIndex'),
          howl = this.howles[index],
          sound = howl._sounds[0]._node,
          buffered = sound.buffered,
          time = sound.currentTime,
          duration = sound.duration,
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
          index = audio.get('currentIndex'),
          howl = this.howles[index]

    if (howl && howl.playing()) {
      howl.seek(howl.duration() * per)
    }
  }

  render() {
    const { audio } = this.props,
          { count, list, currentIndex, status, volume, isMute, artist, title } = audio.toObject(),
          { progress, elapsed, duration, bytesLoaded } = this.state

    return (
      <div>
        <SongSelector
          count={count}
          list={list}
          currentIndex={currentIndex}
          currentStatus={status}
          status={STATUS}
          onPause={this.pause}
          onResume={this.resume}
          onSkipTo={this.skipTo} />
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
          onSeek={this.seek}
          onVolume={this.volume}
          onMute={this.mute}
          onPause={this.pause}
          onResume={this.resume}
          onStop={this.stop}
          onShuffle={this.shuffle}
          onSongNext={this.songNext}
          onSongPrev={this.songPrev}
          onLoop={this.loop}
          onPlay={this.play} />
      </div>
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
        status: T.string.isRequired
      })
    ).isRequired,
    count: T.number.isRequired,
    isLoading: T.bool.isRequired,
    currentIndex: T.number,
    status: T.string.isRequired,
    isLoop: T.bool.isRequired,
    isShuffle: T.bool.isRequired
  }).isRequired,
  progress: T.number.isRequired,
  elapsed: T.number.isRequired,
  duration: T.number.isRequired,
  bytesLoaded: T.number.isRequired
}

AudioPage.defaultProps = {
  progress: 0,
  elapsed: 0,
  duration: 0,
  bytesLoaded: 0
}

function mapStateToProps(state) {
  const { audio } = state.toObject()

  return { audio }
}

export default connect(mapStateToProps)(AudioPage)
