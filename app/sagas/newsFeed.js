import { call, put, fork } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import { getSourceIds, getNewsFeed } from '../services/newsFeed'
import {
  NEWSFEED_REQUEST,
  NEWSFEED_RECEIVE,
  NEWSFEED_RECEIVE_FAILED
} from '../reducers/newsFeed'

export const WATCH_NEWSFEED = 'WATCH_NEWSFEED'

function* fetch() {
  try {
    yield put({ type: NEWSFEED_REQUEST })

    const ids = yield call(getSourceIds),
          response = yield call(getNewsFeed, ids)

    yield put({ type: NEWSFEED_RECEIVE, ...response })
  } catch (error) {
    yield put({ type: NEWSFEED_RECEIVE_FAILED, error })
  }
}

function* watchNewsFeed() {
  yield takeEvery(WATCH_NEWSFEED, fetch)
}

export default function* rootNewsFeed() {
  yield [
    fork(watchNewsFeed)
  ]
}
