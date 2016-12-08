import { call, put, fork } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import { getFavourite } from '../services/favourite'
import {
  FAVOURITE_REQUEST,
  FAVOURITE_RECEIVE,
  FAVOURITE_RECEIVE_FAILED,
  WATCH_FAVOURITE
} from '../constants'

function* fetch(action) {
  try {
    yield put({ type: FAVOURITE_REQUEST })

    const response = yield call(getFavourite, action.step)

    yield put({ type: FAVOURITE_RECEIVE, ...response })
  } catch (error) {
    yield put({ type: FAVOURITE_RECEIVE_FAILED, error })
  }
}

function* watchFavourite() {
  yield takeEvery(WATCH_FAVOURITE, fetch)
}

export default function* rootFavourite() {
  yield [
    fork(watchFavourite)
  ]
}
