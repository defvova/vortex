import { Map } from 'immutable'
import Sound from '../utils/reactSound'
import {
  SONG_PLAYED,
  SONG_STOPPED,
  SONG_PAUSED,
  SONG_PLAYING,
  SONG_PREV,
  SONG_NEXT
} from '../actions/song'

const initState = Map({
  url: '',
  aid: null,
  title: '---- ---- ----',
  artist: '---- ----',
  playStatus: Sound.status.STOPPED,
  songIndex: -1
})

function song(state = initState, action) {
  switch (action.type) {
    case SONG_PLAYED:
      return updateState(state, action)
    case SONG_STOPPED:
      return state.merge({
        url: '',
        aid: null,
        playStatus: Sound.status.STOPPED
      })
    case SONG_PAUSED:
      return state.set('playStatus', Sound.status.PAUSED)
    case SONG_PLAYING:
      return state.set('playStatus', Sound.status.PLAYING)
    case SONG_PREV:
      return updateState(state, action)
    case SONG_NEXT:
      return updateState(state, action)
    default:
      return state
  }
}

function updateState(state, action) {
  return state.merge({
    url: action.song.get('url'),
    aid: action.song.get('aid'),
    title: action.song.get('title'),
    artist: action.song.get('artist'),
    playStatus: Sound.status.PLAYING,
    songIndex: action.index
  })
}

export default song
