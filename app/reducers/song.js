import { Map } from 'immutable'
import Sound from '../utils/reactSound'
import {
  SONG_PLAYED,
  SONG_STOPPED,
  SONG_PAUSED,
  SONG_PLAYING,
  SET_SONG_POSITION,
  SONG_PREV,
  SONG_NEXT
} from '../actions/song'

const initState = Map({
  currentSong: Map({
    url: '',
    aid: null
  }),
  position: 0,
  volume: 100,
  playStatus: Sound.status.STOPPED,
  songIndex: -1
})

function song(state = initState, action) {
  switch (action.type) {
    case SONG_PLAYED:
      return updateState(state, action)
    case SONG_STOPPED:
      return state.merge({
        currentSong: Map({
          url: '',
          aid: null
        }),
        position: 0,
        playStatus: Sound.status.STOPPED
      })
    case SONG_PAUSED:
      return state.set('playStatus', Sound.status.PAUSED)
    case SONG_PLAYING:
      return state.set('playStatus', Sound.status.PLAYING)
    case SET_SONG_POSITION:
      return state.set('position', action.position)
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
    currentSong: Map({
      url: action.currentSong.get('url'),
      aid: action.currentSong.get('aid')
    }),
    position: 0,
    playStatus: Sound.status.PLAYING,
    songIndex: action.index
  })
}

export default song
