import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import counter from './counter'
import audio from './audio'

const rootReducer = combineReducers({
  counter,
  audio,
  routing
})

export default rootReducer
