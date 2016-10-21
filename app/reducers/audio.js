import { Map, List, fromJS } from 'immutable'

export const REQUEST_AUDIOS = 'REQUEST_AUDIOS',
      RECEIVE_AUDIOS = 'RECEIVE_AUDIOS',
      UPDATE_STATUS = 'UPDATE_STATUS',
      UPDATE_LOOP = 'UPDATE_LOOP',
      UPDATE_SHUFFLE = 'UPDATE_SHUFFLE',
      RECEIVE_AUDIOS_FAILED = 'RECEIVE_AUDIOS_FAILED',
      SONG_NEXT = 'SONG_NEXT',
      STATUS = {
        stopped: 'stopped',
        playing: 'playing',
        paused: 'paused'
      },
      initState = Map({
        list: List(),
        howlId: null,
        count: 0,
        offset: 0,
        step: 0,
        maxStep: -1,
        isLoading: false,
        currentIndex: 0,
        duration: 0,
        status: STATUS.stopped,
        isLoop: false,
        isShuffle: false,
        title: '---- ----',
        artist: '---- ----',
        error: null
      }),
      updateStatus = (state, action) => {
        const { index, status } = action,
              audio = state.getIn(['list', index]).toObject(),
              { title, artist, duration } = audio,
              howlId = action.howlId || audio.howlId

        return state.setIn(['list', index, 'status'], status).
              setIn(['list', index, 'howlId'], howlId).
              merge({
                howlId,
                status,
                currentIndex: index,
                title,
                artist,
                duration
              })
      },
      receiveAudios = (state, action) => {
        const { count, list, offset, step } = action

        return state.merge({
          count,
          list: state.get('list').concat(fromJS(list)),
          isLoading: false,
          offset,
          step,
          maxStep: Math.ceil(count / offset)
        })
      }

export default function audio(state = initState, action) {
  switch (action.type) {
    case REQUEST_AUDIOS:
      return state.set('isLoading', true)
    case RECEIVE_AUDIOS:
      return receiveAudios(state, action)
    case UPDATE_STATUS:
      return updateStatus(state, action)
    case SONG_NEXT:
      return updateStatus(state, { ...action, status: STATUS.playing }).
        setIn(['list', action.currentIndex, 'status'], STATUS.stopped)
    case UPDATE_LOOP:
      return state.set('isLoop', !state.get('isLoop'))
    case UPDATE_SHUFFLE:
      return state.set('isShuffle', !state.get('isShuffle'))
    case RECEIVE_AUDIOS_FAILED:
      return state.set('error', action.error)
    default:
      return state
  }
}
