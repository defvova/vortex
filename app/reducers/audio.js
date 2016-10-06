import { Map, List } from 'immutable'
import {
  REQUEST_AUDIOS,
  RECEIVE_AUDIOS,
  UPDATE_STATUS,
  UPDATE_LOOP,
  UPDATE_SHUFFLE,
  UPDATE_VOLUME,
  UPDATE_MUTE
} from '../actions/audio'

const initState = Map({
  list: List(),
  count: 0,
  isLoading: false,
  currentIndex: 0,
  status: 'stopped',
  isLoop: false,
  isShuffle: false,
  volume: 1.0,
  prevVolume: 1.0,
  isMute: false,
  title: '---- ---- ----',
  artist: '---- ----'
})

export default function audio(state = initState, action) {
  switch (action.type) {
    case REQUEST_AUDIOS:
      return state.set('isLoading', true)
    case RECEIVE_AUDIOS:
      return state.merge({
        count: action.count,
        list: action.list,
        isLoading: false
      })
    case UPDATE_STATUS:
      return state.setIn(['list', action.index, 'status'], action.status).merge({
        status: action.status,
        currentIndex: action.index,
        title: state.getIn(['list', action.index, 'title']),
        artist: state.getIn(['list', action.index, 'artist'])
      })
    case UPDATE_LOOP:
      return state.set('isLoop', !state.get('isLoop'))
    case UPDATE_SHUFFLE:
      return state.set('isShuffle', !state.get('isShuffle'))
    case UPDATE_VOLUME:
      return state.merge({
        volume: action.volume,
        isMute: action.isMute
      })
    case UPDATE_MUTE:
      return state.merge({
        isMute: !state.get('isMute'),
        volume: action.volume,
        prevVolume: action.prevVolume
      })
    default:
      return state
  }
}
