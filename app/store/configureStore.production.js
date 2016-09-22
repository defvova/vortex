import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import RavenMiddleware from 'redux-raven-middleware'

const router = routerMiddleware(hashHistory),
      enhancer = applyMiddleware(
        RavenMiddleware('https://e3cd9cd5a85247248989728af7ddd016@sentry.io/100815'),
        thunk,
        router
      )

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer)
}
