import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux-immutable'
import audio from './audio'
import song from './song'

const rootReducer = combineReducers({
  audio,
  song,
  routing
})

export default rootReducer
