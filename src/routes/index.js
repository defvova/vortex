import React from 'react'
import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import App from '../containers/App.jsx'
import Audio from '../containers/Audio.jsx'
import NewsFeed from '../containers/NewsFeed.jsx'
import Favourite from '../containers/Favourite.jsx'

export default (
  <Route path='/' component={App}>
    <Route component={Audio}>
      <IndexRoute component={Favourite} />
      <Route path='newsFeed' component={NewsFeed} />
    </Route>
  </Route>
)
