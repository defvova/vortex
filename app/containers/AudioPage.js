import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'
import { ipcRenderer } from 'electron'

import styles from '../components/audio_page/Style.scss'
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
  songPrev
} from '../actions/song'

class HomePage extends Component {
  componentWillMount() {
    const { dispatch } = this.props

    dispatch(fetchAudios())
  }

  handleVkLogin = () => {
    ipcRenderer.send('get-vk-permission')
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

  handleSongPosition = (position) => {
    const { dispatch } = this.props

    dispatch(updateSongPosition(position))
  }

  render() {
    const { audio, song } = this.props,
          currentSong = song.get('currentSong'),
          url = currentSong.get('url'),
          playStatus = song.get('playStatus'),
          position = song.get('position'),
          volume = song.get('volume'),
          currentAid = currentSong.get('aid'),
          count = audio.get('count'),
          list = audio.get('list'),
          songIndex = song.get('songIndex')

    return (
      <div className={styles.container}>
        <div><a onClick={this.handleVkLogin.bind()}>Login via Vk</a></div>
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
          list={list}
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
          playFromPosition={position}
          volume={volume}
          onPausePlaying={({ position }) => this.handleSongPosition(position)} />
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
    currentSong: I.mapContains({
      url: T.string.isRequired,
      aid: T.number
    }).isRequired,
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
