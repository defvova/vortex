import { Map } from 'immutable'
import createReducer from '../utils/createReducer'
import { UPDATE_PLAYER, UPDATE_LOOP, UPDATE_SHUFFLE, STATUS } from '../constants'

const initState = Map({
  howlId: null,
  status: STATUS.stopped,
  currentAid: null,
  prevState: null,
  duration: 0,
  title: '---- ----',
  artist: '---- ----',
  isLoop: false,
  isShuffle: false
})

export default createReducer(initState, {
  [UPDATE_PLAYER]: (state, action) => {
    return state.merge({ ...action })
  },
  [UPDATE_LOOP]: (state) => {
    return state.set('isLoop', !state.get('isLoop'))
  },
  [UPDATE_SHUFFLE]: (state) => {
    return state.set('isShuffle', !state.get('isShuffle'))
  }
})
