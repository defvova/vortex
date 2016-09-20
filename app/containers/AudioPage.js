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
  updateSongPosition,
  songNext,
  songPrev,
  updatePlayFromPosition,
  updateBytesLoaded
} from '../actions/song'

class HomePage extends Component {
  componentWillMount() {
    const { dispatch } = this.props

    dispatch(fetchAudios())
  }

  handleSongSelected = (currentSong, index) => {
    const { dispatch } = this.props

    dispatch(songPlayed(currentSong, index))
  }

  handleSongPaused = () => {
    const { dispatch } = this.props

    dispatch(songPaused())
  }

  handleSongStopped = () => {
    const { dispatch } = this.props

    dispatch(songStopped())
  }

  handleSongResume = () => {
    const { dispatch } = this.props

    dispatch(songPlaying())
  }

  handleSongPrev = (currentSong, index) => {
    const { dispatch } = this.props

    dispatch(songPrev(currentSong, index))
  }

  handleSongNext = (currentSong, count, index) => {
    const { dispatch } = this.props

    dispatch(songNext(currentSong, count, index))
  }

  handleSongPosition = (audio) => {
    const { dispatch } = this.props,
          elapsed = audio.position,
          duration = audio.duration,
          position = audio.position / audio.duration

    dispatch(updateSongPosition(elapsed, duration, position))
  }

  handlePlayFromPosition = (position) => {
    const { dispatch } = this.props

    dispatch(updatePlayFromPosition(position))
  }

  handleBytesLoaded = (audio) => {
    const { dispatch } = this.props

    dispatch(updateBytesLoaded(audio.bytesLoaded))
  }

  render() {
    const { audio, song } = this.props,
          url = song.get('url'),
          playStatus = song.get('playStatus'),
          position = song.get('position'),
          volume = song.get('volume'),
          currentAid = song.get('aid'),
          count = audio.get('count'),
          list = audio.get('list'),
          songIndex = song.get('songIndex'),
          artist = song.get('artist'),
          title = song.get('title'),
          duration = song.get('duration'),
          elapsed = song.get('elapsed'),
          playFromPosition = song.get('playFromPosition'),
          bytesLoaded = song.get('bytesLoaded')

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
          onSongPosition={this.handlePlayFromPosition.bind(this)}
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
          volume={volume} />
        <br />
      </div>
    )
  }
}

HomePage.propTypes = {
  audio: I.mapContains({
    list: I.list.isRequired,
    count: T.number.isRequired,
    isLoading: T.bool.isRequired
  }).isRequired,
  song: I.mapContains({
    url: T.string.isRequired,
    aid: T.number,
    position: T.number.isRequired,
    volume: T.number.isRequired,
    playStatus: T.string.isRequired,
    songIndex: T.number.isRequired
  }).isRequired,
  dispatch: T.func.isRequired
}

function mapStateToProps(state) {
  const { audio, song } = state

  return { audio, song }
}

export default connect(mapStateToProps)(HomePage)
