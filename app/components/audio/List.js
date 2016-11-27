import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import Waypoint from 'react-waypoint'
import throttle from 'lodash.throttle'
import Header from './Header'

class List extends Component {
  handleMoreAudio = () => {
    const { onLoadMoreAudio, step, maxStep } = this.props

    onLoadMoreAudio(step, maxStep)
  }

  renderWaypoint = () => {
    let throttledHandler = null

    if (!this.props.isLoading) {
      return (
        <tr>
          <td className='is-paddingless'>
            <Waypoint
              onEnter={this.handleMoreAudio.bind()}
              throttleHandler={(scrollHandler) => {
                throttledHandler = throttle(scrollHandler, 300)
                return throttledHandler
              }}
              ref={(component) => {
                if (throttledHandler && !component) {
                  throttledHandler.cancel()
                }
              }}
            />
          </td>
        </tr>
      )
    }
  }

  render() {
    const { onPause, onResume, onSongSelect, count, list, isLoading, onRenderLoading, onControls, onRow } = this.props,
          tbody = list.map((song, index) =>
            onControls(
              song.get('aid'),
              song.get('status')).play && onRow(song, 'play', index, onSongSelect.bind(this, song.get('aid'))
            ) ||
            onControls(
              song.get('aid'),
              song.get('status')).pause && onRow(song, 'pause', index, onPause.bind()
            ) ||
            onControls(
              song.get('aid'),
              song.get('status')).resume && onRow(song, 'play', index, onResume.bind()
            )
          )

    return (
      <section className='songs is-paddingless section'>
        <Header count={count} />
        <div className='track-content'>
          <div className='list'>
            <table className='table is-marginless'>
              <tbody>
                {tbody}
                {this.renderWaypoint()}
              </tbody>
            </table>
            {onRenderLoading(isLoading)}
          </div>
        </div>
      </section>
    )
  }
}

List.propTypes = {
  count: T.number.isRequired,
  list: I.listOf(
    I.mapContains({
      aid: T.number.isRequired,
      title: T.string.isRequired,
      artist: T.string.isRequired,
      url: T.string.isRequired,
      status: T.string.isRequired,
      duration: T.number.isRequired
    })
  ).isRequired,
  isLoading: T.bool.isRequired,
  step: T.number.isRequired,
  maxStep: T.number.isRequired,
  onRenderLoading: T.func.isRequired,
  onControls: T.func.isRequired,
  onRow: T.func.isRequired,
  onLoadMoreAudio: T.func.isRequired,
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongSelect: T.func.isRequired
}

export default List
