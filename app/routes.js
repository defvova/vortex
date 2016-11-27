import React from 'react'
import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import App from './containers/App'
import Audio from './containers/Audio'
import NewsFeed from './containers/NewsFeed'
import Favourite from './containers/Favourite'

export default (
  <Route path='/' component={App}>
    <Route component={Audio}>
      <IndexRoute component={Favourite} />
      <Route path='newsFeed' component={NewsFeed} />
    </Route>
  </Route>
)
