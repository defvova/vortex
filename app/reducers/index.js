import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux-immutable'
import favourite from './favourite'
import newsFeed from './newsFeed'
import player from './player'

const rootReducer = combineReducers({
  favourite,
  newsFeed,
  player,
  routing
})

export default rootReducer
