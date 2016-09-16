import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import AudioPage from './containers/AudioPage'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={AudioPage} />
  </Route>
)
