import React, { Component, PropTypes as T, createElement as el } from 'react'
import I from 'react-immutable-proptypes'
import Header from './Header'
import Row from './Row'
import Loading from './Loading'
import RenderWaypoint from './RenderWaypoint'
import isObjectEqual from '../../utils/isObjectEqual'

class List extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  render() {
    const {
      onPause,
      onResume,
      onSongSelect,
      count,
      list,
      isLoading,
      onControls,
      onLoadMoreAudio,
      step,
      maxStep
     } = this.props,
    tbody = list.map((song, index) =>
      onControls(song.get('aid'), song.get('status')).play &&
        el(Row, {
          key: index,
          song,
          cls: 'play',
          index,
          clickHandler: onSongSelect
        }) ||
      onControls(song.get('aid'), song.get('status')).pause &&
        el(Row, {
          key: index,
          song,
          cls: 'pause',
          index,
          clickHandler: onPause
        }) ||
      onControls(song.get('aid'), song.get('status')).resume &&
        el(Row, {
          key: index,
          song,
          cls: 'play',
          index,
          clickHandler: onResume
        })
    )

    return (
      el('section', { className: 'songs is-paddingless section' },
        el(Header, { count }),
        el('div', { className: 'track-content' },
          el('div', { className: 'list' },
            el('table', { className: 'table is-marginless' },
              el('tbody', {}, tbody,
                el(RenderWaypoint, {
                  isLoading,
                  onLoadMoreAudio,
                  step,
                  maxStep
                })
              )
            ),
            el(Loading, { isLoading })
          )
        )
      )
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
  onControls: T.func.isRequired,
  onLoadMoreAudio: T.func.isRequired,
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongSelect: T.func.isRequired
}

export default List
