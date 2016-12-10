import { Map } from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import createReducer from '../utils/createReducer'

const initState = Map({
  locationBeforeTransitions: null
})

export default createReducer(initState, {
  [LOCATION_CHANGE]: (state, action) => {
    return state.set('locationBeforeTransitions', action.payload)
  }
})
