import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import audio from './audio'
import song from './song'

const rootReducer = combineReducers({
  audio,
  song,
  routing
})

export default rootReducer
