import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import { hashHistory } from 'react-router'
import { routerMiddleware, push } from 'react-router-redux'
import perflogger from 'redux-perf-middleware'
import freeze from 'redux-freeze'
import { Map } from 'immutable'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers'
import rootSagas from '../sagas'

const actionCreators = { push },
      sagaMiddleware = createSagaMiddleware(),
      initialState = Map(),
      logger = createLogger({
        level: 'info',
        collapsed: true
      }),
      router = routerMiddleware(hashHistory),
      enhancer = compose(
        applyMiddleware(
          sagaMiddleware,
          require('redux-immutable-state-invariant')(),
          freeze,
          perflogger,
          router,
          logger
        ),
        window.devToolsExtension ?
          window.devToolsExtension({ actionCreators }) :
          (noop) => noop
      )

export default function configureStore() {
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(rootSagas)

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store)
  }

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    )
  }

  return store
}
