import { fork } from 'redux-saga/effects'
import rootFavourite from './favourite'
import rootPlayer from './player'
import rootNewsFeed from './newsFeed'

export default function* rootSagas() {
  yield [
    fork(rootFavourite),
    fork(rootPlayer),
    fork(rootNewsFeed)
  ]
}
