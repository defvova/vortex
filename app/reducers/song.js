import { Map } from 'immutable'
import Sound from '../utils/reactSound'
import {
  SONG_PLAYED,
  SONG_STOPPED,
  SONG_PAUSED,
  SONG_PLAYING,
  SET_SONG_POSITION,
  SONG_PREV,
  SONG_NEXT,
  SET_PLAY_FROM_POSITION,
  SET_BYTES_LOADED
} from '../actions/song'

const initState = Map({
  url: '',
  aid: null,
  title: '---- ---- ----',
  artist: '---- ----',
  position: 0,
  elapsed: 0,
  duration: 0,
  playFromPosition: 0,
  volume: 100,
  playStatus: Sound.status.STOPPED,
  songIndex: -1,
  bytesLoaded: 0
})

function song(state = initState, action) {
  switch (action.type) {
    case SONG_PLAYED:
      return updateState(state, action)
    case SONG_STOPPED:
      return state.merge({
        url: '',
        aid: null,
        position: 0,
        elapsed: 0,
        playFromPosition: 0,
        playStatus: Sound.status.STOPPED
      })
    case SONG_PAUSED:
      return state.set('playStatus', Sound.status.PAUSED)
    case SONG_PLAYING:
      return state.set('playStatus', Sound.status.PLAYING)
    case SET_SONG_POSITION:
      return state.merge({
        position: action.position,
        elapsed: action.elapsed,
        duration: action.duration
      })
    case SONG_PREV:
      return updateState(state, action)
    case SONG_NEXT:
      return updateState(state, action)
    case SET_PLAY_FROM_POSITION:
      return state.set('playFromPosition', action.position)
    case SET_BYTES_LOADED:
      return state.set('bytesLoaded', action.bytesLoaded)
    default:
      return state
  }
}

function updateState(state, action) {
  return state.merge({
    url: action.currentSong.get('url'),
    aid: action.currentSong.get('aid'),
    title: action.currentSong.get('title'),
    artist: action.currentSong.get('artist'),
    position: 0,
    playStatus: Sound.status.PLAYING,
    songIndex: action.index
  })
}

export default song
