import { fromJS } from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = fromJS({
  locationBeforeTransitions: null
})

export default (state = initialState, { type, payload }) => {
  if (type === LOCATION_CHANGE) {
    return state.set('locationBeforeTransitions', payload)
  }

  return state
}
