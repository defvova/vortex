import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import hashHistory from 'react-router/lib/hashHistory'
import { routerMiddleware, push } from 'react-router-redux'
import perflogger from 'redux-perf-middleware'
import freeze from 'redux-freeze'
import { Map } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers'
import rootSagas from '../sagas'

const actionCreators = { push },
      sagaMiddleware = createSagaMiddleware(),
      logger = createLogger({
        level: 'info',
        collapsed: true
      }),
      router = routerMiddleware(hashHistory),
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators }) : compose,
      enhancer = composeEnhancers(applyMiddleware(
        sagaMiddleware,
        require('redux-immutable-state-invariant')(),
        freeze,
        perflogger,
        router,
        logger
      ))

export default function configureStore(initialState: Map) {
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(rootSagas)

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  return store
}
