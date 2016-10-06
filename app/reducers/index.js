import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux-immutable'
import audio from './audio'

const rootReducer = combineReducers({
  audio,
  routing
})

export default rootReducer
