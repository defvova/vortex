import { call, put, fork } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import {
  getAudios,
  playHowl,
  pauseHowl,
  stopHowl,
  getNextIndex,
  getPrevIndex,
  loopHowl,
  resumeHowl
} from '../services/audio'
import {
  REQUEST_AUDIOS,
  RECEIVE_AUDIOS,
  UPDATE_STATUS,
  UPDATE_LOOP,
  UPDATE_SHUFFLE,
  RECEIVE_AUDIOS_FAILED,
  SONG_NEXT
} from '../reducers/audio'

export const WATCH_LOAD_MORE = 'WATCH_LOAD_MORE',
      WATCH_UPDATE_LOOP = 'WATCH_UPDATE_LOOP',
      WATCH_UPDATE_SHUFFLE = 'WATCH_UPDATE_SHUFFLE',
      WATCH_PLAY_SONG = 'WATCH_PLAY_SONG',
      WATCH_PAUSE_SONG = 'WATCH_PAUSE_SONG',
      WATCH_NEXT_SONG = 'WATCH_NEXT_SONG',
      WATCH_PREV_SONG = 'WATCH_PREV_SONG',
      WATCH_SELECT_SONG = 'WATCH_SELECT_SONG',
      WATCH_RESUME_SONG = 'WATCH_RESUME_SONG'

function* fetchAudios(action) {
  try {
    yield put({ type: REQUEST_AUDIOS })

    const response = yield call(getAudios, action),
          { count, list, step, offset } = response

    yield put({ type: RECEIVE_AUDIOS, count, list, step, offset })
  } catch (error) {
    yield put({ type: RECEIVE_AUDIOS_FAILED, error })
  }
}

function* updateStatus(action) {
  const { index, status, howlId } = action

  yield put({ type: UPDATE_STATUS, index, status, howlId })
}

function* updateLoop(action) {
  yield put({ type: UPDATE_LOOP })
  yield call(loopHowl, action)
}

function* updateShuffle() {
  yield put({ type: UPDATE_SHUFFLE })
}

function* playSong(action) {
  const howlId = yield call(playHowl, action)

  yield fork(updateStatus, { ...action, howlId })
}

function* pauseSong(action) {
  yield fork(updateStatus, action)
  yield call(pauseHowl, action.howlId)
}

function* resumeSong(action) {
  yield fork(updateStatus, action)
  yield call(resumeHowl, action.howlId)
}

function* skipTo(action, index) {
  const { onSongNext, onStep, onBytesLoaded, audio } = action,
        { currentIndex, isLoop, howlId } = audio.toObject(),
        url = audio.getIn(['list', index, 'url'])

  yield call(stopHowl, howlId)
  const id = yield call(playHowl, { url, isLoop, onSongNext, onStep, onBytesLoaded }) // eslint-disable-line one-var

  yield put({ type: SONG_NEXT, index, currentIndex, howlId: id })
}

function* nextSong(action) {
  const index = yield call(getNextIndex, action.audio.toObject())

  yield fork(skipTo, action, index)
}

function* prevSong(action) {
  const index = yield call(getPrevIndex, action.audio.toObject())

  yield fork(skipTo, action, index)
}

function* selectSong(action) {
  const { index } = action

  yield fork(skipTo, action, index)
}

function* watchLoadMore() {
  yield takeEvery(WATCH_LOAD_MORE, fetchAudios)
}

function* watchUpdateLoop() {
  yield takeEvery(WATCH_UPDATE_LOOP, updateLoop)
}

function* watchUpdateShuffle() {
  yield takeEvery(WATCH_UPDATE_SHUFFLE, updateShuffle)
}

function* watchPlaySong() {
  yield takeEvery(WATCH_PLAY_SONG, playSong)
}

function* watchPauseSong() {
  yield takeEvery(WATCH_PAUSE_SONG, pauseSong)
}

function* watchNextSong() {
  yield takeEvery(WATCH_NEXT_SONG, nextSong)
}

function* watchResumeSong() {
  yield takeEvery(WATCH_RESUME_SONG, resumeSong)
}

function* watchPrevSong() {
  yield takeEvery(WATCH_PREV_SONG, prevSong)
}

function* watchSelectSong() {
  yield takeEvery(WATCH_SELECT_SONG, selectSong)
}

export default function* rootAudio() {
  yield [
    fork(fetchAudios),
    fork(watchLoadMore),
    fork(watchUpdateLoop),
    fork(watchUpdateShuffle),
    fork(watchPlaySong),
    fork(watchPauseSong),
    fork(watchNextSong),
    fork(watchPrevSong),
    fork(watchSelectSong),
    fork(watchResumeSong)
  ]
}
