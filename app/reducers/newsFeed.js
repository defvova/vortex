import { Map, List, fromJS } from 'immutable'
import createReducer from '../utils/createReducer'
import {
  NEWSFEED_REQUEST,
  NEWSFEED_RECEIVE,
  NEWSFEED_RECEIVE_FAILED,
  NEWSFEED_UPDATE_STATUS,
  NEWSFEED_SONG_NEXT,
  NEWSFEED_SONG_STOP,
  STATUS
} from '../constants'

const initState = Map({
        list: List(),
        profiles: List(),
        isLoading: false,
        count: 0,
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
      newsFeedReceive = ({ state, list, profiles }) => {
        return state.merge({
          list: fromJS(list),
          profiles: fromJS(profiles),
          count: list.length,
          isLoading: false
        })
      }

export default createReducer(initState, {
  [NEWSFEED_REQUEST]: (state) => {
    return state.set('isLoading', true)
  },
  [NEWSFEED_RECEIVE]: (state, action) => {
    return newsFeedReceive({ state, ...action })
  },
  [NEWSFEED_UPDATE_STATUS]: (state, action) => {
    return updateStatus({ state, ...action })
  },
  [NEWSFEED_SONG_NEXT]: (state, action) => {
    if (action.prevAid === action.aid || getIndex(state, action.prevAid) < 0) {
      return updateStatus({ state, ...action })
    }

    return updateStatus({ state, ...action }).
      setIn(['list', getIndex(state, action.prevAid), 'status'], STATUS.stopped)
  },
  [NEWSFEED_SONG_STOP]: (state, { aid }) => {
    if (getIndex(state, aid) < 0) {
      return state
    }

    return state.setIn(['list', getIndex(state, aid), 'status'], STATUS.stopped)
  },
  [NEWSFEED_RECEIVE_FAILED]: (state, action) => {
    return state.set('error', action.error)
  }
})
