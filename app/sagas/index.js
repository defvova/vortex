import { fork } from 'redux-saga/effects'
import rootAudio from './audio'

export default function* rootSagas() {
  yield [
    fork(rootAudio)
  ]
}
