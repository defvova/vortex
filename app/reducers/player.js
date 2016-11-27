import { Map } from 'immutable'

export const UPDATE_LOOP = 'UPDATE_LOOP',
      UPDATE_SHUFFLE = 'UPDATE_SHUFFLE',
      UPDATE_PLAYER = 'UPDATE_PLAYER',
      STATUS = {
        stopped: 'stopped',
        playing: 'playing',
        paused: 'paused'
      }

const initState = Map({ // eslint-disable-line one-var
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

export default function player(state = initState, action) {
  switch (action.type) {
    case UPDATE_PLAYER:
      return state.merge({ ...action })
    case UPDATE_LOOP:
      return state.set('isLoop', !state.get('isLoop'))
    case UPDATE_SHUFFLE:
      return state.set('isShuffle', !state.get('isShuffle'))
    default:
      return state
  }
}
