import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'

import SongSelector from '../components/audio_page/SongSelector'
import PlayerControl from '../components/audio_page/PlayerControl'
import Sound from '../utils/reactSound'
import { fetchAudios } from '../actions/audio'
import {
  songPlayed,
  songStopped,
  songPaused,
  songPlaying,
  songNext,
  songPrev
} from '../actions/song'

class AudioPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      position: props.position,
      elapsed: props.elapsed,
      duration: props.duration,
      playFromPosition: props.playFromPosition,
      bytesLoaded: props.bytesLoaded,
      volume: props.volume,
      prevVolume: props.prevVolume,
      mute: props.mute,
      shuffle: props.shuffle
    }
  }

  componentWillMount() {
    const { dispatch } = this.props

    dispatch(fetchAudios())
  }

  handleSongSelected = (song, index) => {
    const { dispatch } = this.props

    dispatch(songPlayed(song, index))
  }

  handleSongPaused = () => {
    const { dispatch } = this.props

    dispatch(songPaused())
  }

  handleSongStopped = () => {
    const { dispatch } = this.props

    this.setState({ elapsed: 0, position: 0 })
    dispatch(songStopped())
  }

  handleSongResume = () => {
    const { dispatch } = this.props

    dispatch(songPlaying())
  }

  handleSongPrev = (song, index) => {
    const { dispatch } = this.props

    dispatch(songPrev(song, index))
  }

  handleSongNext = (song, count, index) => {
    const { dispatch } = this.props

    dispatch(songNext(song, count, index))
  }

  handleSongPosition = (audio) => {
    const elapsed = audio.position,
          duration = audio.duration,
          position = audio.position / audio.duration

    this.setState({ elapsed, duration, position })
  }

  handlePlayFromPosition = (playFromPosition) => {
    this.setState({ playFromPosition })
  }

  handleBytesLoaded = (audio) => {
    this.setState({ bytesLoaded: audio.bytesLoaded })
  }

  handleVolume = (volume) => {
    this.setState({ volume, mute: false })
  }

  handleMute = () => {
    const { mute, volume, prevVolume } = this.state

    mute && this.setState({ volume: prevVolume, mute: !mute })
    !mute && this.setState({ prevVolume: volume, volume: 0, mute: !mute })
  }

  handleShuffle = () => {
    const { shuffle } = this.state

    this.setState({ shuffle: !shuffle })
  }

  render() {
    const { audio, song } = this.props,
          { duration, elapsed, bytesLoaded, position, playFromPosition, volume, mute, shuffle } = this.state,
          url = song.get('url'),
          playStatus = song.get('playStatus'),
          currentAid = song.get('aid'),
          count = audio.get('count'),
          list = audio.get('list'),
          songIndex = song.get('songIndex'),
          artist = song.get('artist'),
          title = song.get('title'),
          unMute = !mute

    return (
      <div>
        <PlayerControl
          soundStatuses={Sound.status}
          count={count}
          songIndex={songIndex}
          onSongSelected={this.handleSongSelected.bind(this)}
          onPause={this.handleSongPaused.bind()}
          onResume={this.handleSongResume.bind()}
          onStopped={this.handleSongStopped.bind()}
          onNext={this.handleSongNext.bind(this)}
          onPrev={this.handleSongPrev.bind(this)}
          title={title}
          artist={artist}
          list={list}
          duration={duration}
          elapsed={elapsed}
          position={position}
          bytesLoaded={bytesLoaded}
          volume={volume}
          onVolume={this.handleVolume.bind(this)}
          onSongPosition={this.handlePlayFromPosition.bind(this)}
          onMute={this.handleMute.bind()}
          mute={mute}
          onShuffle={this.handleShuffle.bind()}
          shuffle={shuffle}
          playStatus={playStatus} />
        <SongSelector
          count={count}
          list={list}
          playStatus={playStatus}
          soundStatuses={Sound.status}
          currentAid={currentAid}
          onPause={this.handleSongPaused.bind()}
          onResume={this.handleSongResume.bind()}
          onStopped={this.handleSongStopped.bind()}
          onSongSelected={this.handleSongSelected.bind(this)} />
        <Sound
          url={url}
          playStatus={playStatus}
          onPlaying={this.handleSongPosition.bind(this)}
          playFromPosition={playFromPosition}
          onLoading={this.handleBytesLoaded.bind(this)}
          mute={mute}
          unMute={unMute}
          volume={volume} />
        <br />
      </div>
    )
  }
}

AudioPage.propTypes = {
  audio: I.mapContains({
    list: I.list.isRequired,
    count: T.number.isRequired,
    isLoading: T.bool.isRequired
  }).isRequired,
  song: I.mapContains({
    url: T.string.isRequired,
    aid: T.number,
    title: T.string.isRequired,
    artist: T.string.isRequired,
    playStatus: T.string.isRequired,
    songIndex: T.number.isRequired
  }).isRequired,
  dispatch: T.func.isRequired,
  position: T.number.isRequired,
  elapsed: T.number.isRequired,
  duration: T.number.isRequired,
  playFromPosition: T.number.isRequired,
  volume: T.number.isRequired,
  prevVolume: T.number.isRequired,
  mute: T.bool.isRequired,
  bytesLoaded: T.number.isRequired,
  shuffle: T.bool.isRequired
}

AudioPage.defaultProps = {
  position: 0,
  elapsed: 0,
  duration: 0,
  playFromPosition: 0,
  bytesLoaded: 0,
  volume: 100,
  prevVolume: 100,
  mute: false,
  shuffle: false
}

function mapStateToProps(state) {
  const { audio, song } = state

  return { audio, song }
}

export default connect(mapStateToProps)(AudioPage)
