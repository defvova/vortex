import { Map, List, fromJS } from 'immutable'
import { STATUS } from './player'

export const NEWSFEED_REQUEST = 'NEWSFEED_REQUEST',
      NEWSFEED_RECEIVE = 'NEWSFEED_RECEIVE',
      NEWSFEED_RECEIVE_FAILED = 'NEWSFEED_RECEIVE_FAILED',
      NEWSFEED_UPDATE_STATUS = 'NEWSFEED_UPDATE_STATUS',
      NEWSFEED_SONG_NEXT = 'NEWSFEED_SONG_NEXT',
      NEWSFEED_SONG_STOP = 'NEWSFEED_SONG_STOP'

const initState = Map({ // eslint-disable-line one-var
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
      updateStatus = (state, aid, howlId, status) => {
        const index = getIndex(state, aid),
              audio = state.getIn(['list', index])

        return state.setIn(['list', index], audio.merge({ howlId, status }))
      },
      newsFeedReceive = (state, list, profiles) => {
        return state.merge({
          list: fromJS(list),
          profiles: fromJS(profiles),
          count: list.length,
          isLoading: false
        })
      }

export default function newsFeed(state = initState, {
  type,
  list,
  profiles,
  howlId,
  status,
  prevAid,
  aid,
  error
}) {
  switch (type) {
    case NEWSFEED_REQUEST:
      return state.set('isLoading', true)
    case NEWSFEED_RECEIVE:
      return newsFeedReceive(state, list, profiles)
    case NEWSFEED_UPDATE_STATUS:
      return updateStatus(state, aid, howlId, status)
    case NEWSFEED_SONG_NEXT:
      if (prevAid === aid || getIndex(state, prevAid) < 0) {
        return updateStatus(state, aid, howlId, status)
      }

      return updateStatus(state, aid, howlId, status).
        setIn(['list', getIndex(state, prevAid), 'status'], STATUS.stopped)
    case NEWSFEED_SONG_STOP:
      if (getIndex(state, aid) < 0) {
        return state
      }

      return state.setIn(['list', getIndex(state, aid), 'status'], STATUS.stopped)
    case NEWSFEED_RECEIVE_FAILED:
      return state.set('error', error)
    default:
      return state
  }
}
