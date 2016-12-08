import { combineReducers } from 'redux-immutable'
import favourite from './favourite'
import newsFeed from './newsFeed'
import player from './player'
import routing from './routing'

const rootReducer = combineReducers({
  routing,
  favourite,
  newsFeed,
  player
})

export default rootReducer
