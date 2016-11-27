/* eslint-disable react/prop-types */
import React from 'react'
import List from '../components/audio/List'

class Favourite extends React.Component {
  componentDidMount() {
    if (!window.favouriteIgnoreFetch) {
      this.props.onFetchFavourite()
    }
  }

  componentWillUnmount() {
    window.favouriteIgnoreFetch = true
  }

  render() {
    const { audio,
            onRenderLoading,
            onLoadMoreAudio,
            onPause,
            onResume,
            onSongSelect,
            onControls,
            onRow } = this.props,
          { list, isLoading, step, maxStep, count } = audio.toObject()

    return (
      <List
        count={count}
        list={list}
        isLoading={isLoading}
        step={step}
        maxStep={maxStep}
        onRenderLoading={onRenderLoading}
        onControls={onControls}
        onRow={onRow}
        onLoadMoreAudio={onLoadMoreAudio}
        onPause={onPause}
        onResume={onResume}
        onSongSelect={onSongSelect} />
    )
  }
}

export default Favourite
