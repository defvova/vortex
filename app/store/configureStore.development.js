import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { hashHistory } from 'react-router'
import { routerMiddleware, push } from 'react-router-redux'
import perflogger from 'redux-perf-middleware'
import reduxUnhandledAction from 'redux-unhandled-action'
import freeze from 'redux-freeze'
import { Map } from 'immutable'
import rootReducer from '../reducers'

import * as audio from '../actions/audio'

const actionCreators = {
        ...audio,
        push
      },
      initialState = Map(),
      logger = createLogger({
        level: 'info',
        collapsed: true
      }),
      router = routerMiddleware(hashHistory),
      callback = (action) => {
        console.error(`${action} didn't lead to creation of a new state object`) // eslint-disable-line no-console
      },
      enhancer = compose(
        applyMiddleware(
          require('redux-immutable-state-invariant')(),
          reduxUnhandledAction(callback),
          freeze,
          perflogger,
          thunk,
          router,
          logger
        ),
        window.devToolsExtension ?
          window.devToolsExtension({ actionCreators }) :
          (noop) => noop
      )

export default function configureStore() {
  const store = createStore(rootReducer, initialState, enhancer)

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
