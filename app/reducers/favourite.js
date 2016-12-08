import { Map, List, fromJS } from 'immutable'
import createReducer from '../utils/createReducer'
import {
  FAVOURITE_REQUEST,
  FAVOURITE_RECEIVE,
  FAVOURITE_RECEIVE_FAILED,
  FAVOURITE_UPDATE_STATUS,
  FAVOURITE_SONG_NEXT,
  FAVOURITE_SONG_STOP,
  STATUS
} from '../constants'

const initState = Map({
        list: List(),
        count: 0,
        offset: 0,
        step: 0,
        maxStep: -1,
        isLoading: false,
        error: null
      }),
      getIndex = (state, aid) => {
        return state.get('list').findIndex((a) => {
          return a.get('aid') === aid
        })
      },
      updateStatus = ({ state, aid, howlId, status }) => {
        const index = getIndex(state, aid),
              audio = state.getIn(['list', index])

        return state.setIn(['list', index], audio.merge({ howlId, status }))
      },
      receiveFavourites = ({ state, count, list, offset, step }) => {
        return state.merge({
          count,
          list: state.get('list').concat(fromJS(list)),
          isLoading: false,
          offset,
          step,
          maxStep: Math.ceil(count / offset)
        })
      }

export default createReducer(initState, {
  [FAVOURITE_REQUEST]: (state) => {
    return state.set('isLoading', true)
  },
  [FAVOURITE_RECEIVE]: (state, action) => {
    return receiveFavourites({ state, ...action })
  },
  [FAVOURITE_UPDATE_STATUS]: (state, action) => {
    return updateStatus({ state, ...action })
  },
  [FAVOURITE_SONG_NEXT]: (state, action) => {
    if (action.prevAid === action.aid || getIndex(state, action.prevAid) < 0) {
      return updateStatus({ state, ...action })
    }

    return updateStatus({ state, ...action }).
      setIn(['list', getIndex(state, action.prevAid), 'status'], STATUS.stopped)
  },
  [FAVOURITE_SONG_STOP]: (state, { aid }) => {
    if (getIndex(state, aid) < 0) {
      return state
    }

    return state.setIn(['list', getIndex(state, aid), 'status'], STATUS.stopped)
  },
  [FAVOURITE_RECEIVE_FAILED]: (state, action) => {
    return state.set('error', action.error)
  }
})
