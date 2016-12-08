import React, { PropTypes as T, createElement as el } from 'react'
import I from 'react-immutable-proptypes'
import List from '../components/audio/List'
import { connect } from 'react-redux'
import isObjectEqual from '../utils/isObjectEqual'
import { WATCH_FAVOURITE } from '../constants'

class Favourite extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    if (!isObjectEqual(this.props.favourite, nextProps.favourite)) {
      return true
    }

    return false
  }

  componentDidMount() {
    if (!window.favouriteIgnoreFetch) {
      this.fetchFavourite()
    }
  }

  componentWillUnmount() {
    window.favouriteIgnoreFetch = true
  }

  fetchFavourite = () => {
    this.props.dispatch({ type: WATCH_FAVOURITE })
  }

  loadMoreAudio = (step, maxStep) => {
    if (step > 0 && step !== maxStep) {
      this.props.dispatch({ type: WATCH_FAVOURITE, step })
    }
  }

  render() {
    const { onControls, onPause, onResume, onSongSelect, onPlay, favourite } = this.props,
          { list, isLoading, step, maxStep, count } = favourite.toObject()

    return el(List, {
      list,
      isLoading,
      step,
      maxStep,
      count,
      onFetchFavourite: this.fetchFavourite,
      onLoadMoreAudio: this.loadMoreAudio,
      onControls,
      onPause,
      onResume,
      onSongSelect,
      onPlay
    })
  }
}

Favourite.propTypes = {
  dispatch: T.func.isRequired,
  onControls: T.func.isRequired,
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongSelect: T.func.isRequired,
  onPlay: T.func.isRequired,
  favourite: I.mapContains({
    list: I.listOf(
      I.mapContains({
        aid: T.number.isRequired,
        title: T.string.isRequired,
        artist: T.string.isRequired,
        url: T.string.isRequired,
        status: T.string.isRequired,
        duration: T.number.isRequired,
        howlId: T.number
      })
    ).isRequired,
    count: T.number.isRequired,
    step: T.number.isRequired,
    maxStep: T.number.isRequired,
    isLoading: T.bool.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {
    favourite: state.get('favourite')
  }
}

export default connect(mapStateToProps)(Favourite)
