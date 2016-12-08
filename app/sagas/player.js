import { call, put, fork } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import {
  playHowl,
  pauseHowl,
  stopHowl,
  getNextIndex,
  getPrevIndex,
  loopHowl,
  resumeHowl
} from '../services/player'
import {
  UPDATE_PLAYER,
  UPDATE_LOOP,
  UPDATE_SHUFFLE,

  WATCH_UPDATE_LOOP,
  WATCH_UPDATE_SHUFFLE,
  WATCH_PLAY_SONG,
  WATCH_PAUSE_SONG,
  WATCH_NEXT_SONG,
  WATCH_PREV_SONG,
  WATCH_SELECT_SONG,
  WATCH_RESUME_SONG
} from '../constants'

const toParams = ({
  player,
  audio,
  currentStateName,
  onSongNext,
  onStep,
  onBytesLoaded,
  aid,
  status,
  currAid
}) => {
  const { count, list } = audio.toObject(),
        { isShuffle, currentAid, prevState, isLoop, howlId } = player.toObject(),
        size = list.size,
        currentIndex = list.findIndex((a) => {
          return a.get('aid') === currentAid
        })

  return {
    count,
    list,
    isShuffle,
    currentAid,
    prevState,
    isLoop,
    howlId,
    size,
    currentIndex,
    onSongNext,
    onStep,
    onBytesLoaded,
    aid,
    status,
    currentStateName,
    currAid
  }
}

function* updateStatus(action) {
  const type = `${action.currentStateName.toUpperCase()}_UPDATE_STATUS`

  yield put({ ...action, type })
}

function* stopAudio(prevState, nextState, aid) {
  if (prevState && prevState != nextState) {
    const type = `${prevState.toUpperCase()}_SONG_STOP`

    yield put({ type, aid })
  }
}

function* skipTo(action) {
  yield call(stopHowl, action.howlId)
  yield fork(stopAudio, action.prevState, action.currentStateName, action.currentAid)

  const audio = action.list.find((a) => {
          return a.get('aid') === action.aid
        }),
        type = `${action.currentStateName.toUpperCase()}_SONG_NEXT`,
        id = yield call(playHowl,
          audio.get('url'),
          action.isLoop,
          action.onSongNext,
          action.onStep,
          action.onBytesLoaded
        )

  yield put({ type, prevAid: action.currentAid, aid: action.aid, status: action.status, howlId: id })
  yield put({
    type: UPDATE_PLAYER,
    currentAid: action.aid,
    title: audio.get('title'),
    artist: audio.get('artist'),
    duration: audio.get('duration'),
    howlId: id,
    status: action.status,
    prevState: action.currentStateName
  })
}

function* updateLoop(action) {
  yield call(loopHowl, action.howlId, action.isLoop)
  yield put({ type: UPDATE_LOOP })
}

function* updateShuffle() {
  yield put({ type: UPDATE_SHUFFLE })
}

function* playSong(action) {
  const params = toParams(action),
        audio = params.list.find((a) => {
          return a.get('aid') === params.currAid
        }) || params.list.first(),
        id = yield call(playHowl,
          audio.get('url'),
          params.isLoop,
          params.onSongNext,
          params.onStep,
          params.onBytesLoaded
        )

  yield fork(updateStatus, {
    aid: audio.get('aid'),
    status: params.status,
    howlId: id,
    currentStateName: params.currentStateName
  })
  yield put({
    type: UPDATE_PLAYER,
    currentAid: audio.get('aid'),
    howlId: id,
    status: params.status,
    isLoop: params.isLoop,
    duration: audio.get('duration'),
    title: audio.get('title'),
    artist: audio.get('artist'),
    prevState: params.currentStateName
  })
}

function* pauseSong(action) {
  yield fork(updateStatus, action)
  yield call(pauseHowl, action.howlId)
  yield put({ ...action, type: UPDATE_PLAYER })
}

function* resumeSong(action) {
  yield fork(updateStatus, action)
  yield call(resumeHowl, action.howlId)
  yield put({ ...action, type: UPDATE_PLAYER })
}

function* nextSong(action) {
  const params = toParams(action),
        index = yield call(getNextIndex, params.isShuffle, params.size, params.count, params.currentIndex),
        aid = params.list.getIn([index, 'aid']),
        currentStateName = params.prevState || params.currentStateName

  yield fork(skipTo, { ...params, aid, currentStateName })
}

function* prevSong(action) {
  const params = toParams(action),
        index = yield call(getPrevIndex, params.isShuffle, params.size, params.currentIndex),
        aid = params.list.getIn([index, 'aid']),
        currentStateName = params.prevState || params.currentStateName

  yield fork(skipTo, { ...params, aid, currentStateName })
}

function* selectSong(action) {
  yield fork(skipTo, toParams(action))
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

export default function* rootPlayer() {
  yield [
    fork(watchUpdateLoop),
    fork(watchUpdateShuffle),
    fork(watchPlaySong),
    fork(watchPauseSong),
    fork(watchNextSong),
    fork(watchResumeSong),
    fork(watchPrevSong),
    fork(watchSelectSong)
  ]
}
