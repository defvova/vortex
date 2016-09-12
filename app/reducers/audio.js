import { Map, List } from 'immutable'
import { REQUEST_AUDIOS, RECEIVE_AUDIOS } from '../actions/audio'

const initState = Map({
  list: List(),
  count: 0,
  isLoading: false
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
    default:
      return state
  }
}
