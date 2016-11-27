import { Map, List, fromJS } from 'immutable'
import { STATUS } from './player'

export const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST',
      FAVOURITE_RECEIVE = 'FAVOURITE_RECEIVE',
      FAVOURITE_RECEIVE_FAILED = 'FAVOURITE_RECEIVE_FAILED',
      FAVOURITE_UPDATE_STATUS = 'FAVOURITE_UPDATE_STATUS',
      FAVOURITE_SONG_NEXT = 'FAVOURITE_SONG_NEXT',
      FAVOURITE_SONG_STOP = 'FAVOURITE_SONG_STOP'

const initState = Map({ // eslint-disable-line one-var
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
      updateStatus = (state, aid, howlId, status) => {
        const index = getIndex(state, aid),
              audio = state.getIn(['list', index])

        return state.setIn(['list', index], audio.merge({ howlId, status }))
      },
      receiveFavourites = (state, count, list, offset, step) => {
        return state.merge({
          count,
          list: state.get('list').concat(fromJS(list)),
          isLoading: false,
          offset,
          step,
          maxStep: Math.ceil(count / offset)
        })
      }

export default function favourite(state = initState, {
  type,
  count,
  list,
  offset,
  step,
  howlId,
  status,
  prevAid,
  aid,
  error
}) {
  switch (type) {
    case FAVOURITE_REQUEST:
      return state.set('isLoading', true)
    case FAVOURITE_RECEIVE:
      return receiveFavourites(state, count, list, offset, step)
    case FAVOURITE_UPDATE_STATUS:
      return updateStatus(state, aid, howlId, status)
    case FAVOURITE_SONG_NEXT:
      if (prevAid === aid || getIndex(state, prevAid) < 0) {
        return updateStatus(state, aid, howlId, status)
      }

      return updateStatus(state, aid, howlId, status).
        setIn(['list', getIndex(state, prevAid), 'status'], STATUS.stopped)
    case FAVOURITE_SONG_STOP:
      if (getIndex(state, aid) < 0) {
        return state
      }

      return state.setIn(['list', getIndex(state, aid), 'status'], STATUS.stopped)
    case FAVOURITE_RECEIVE_FAILED:
      return state.set('error', error)
    default:
      return state
  }
}
