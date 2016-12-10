import { createStore, applyMiddleware } from 'redux'
import hashHistory from 'react-router/lib/hashHistory'
import { routerMiddleware } from 'react-router-redux'
import { Map } from 'immutable'
import RavenMiddleware from 'redux-raven-middleware'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers'
import rootSagas from '../sagas'

const router = routerMiddleware(hashHistory),
      sagaMiddleware = createSagaMiddleware(),
      enhancer = applyMiddleware(
        sagaMiddleware,
        RavenMiddleware('https://e3cd9cd5a85247248989728af7ddd016@sentry.io/100815'),
        router
      )

export default function configureStore(initialState: Map) {
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(rootSagas)
  return store
}
