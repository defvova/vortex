import React, { Component, PropTypes as T, createElement as el } from 'react'
import { connect } from 'react-redux'
import I from 'react-immutable-proptypes'
import { WATCH_NEWSFEED } from '../constants'
import Header from '../components/audio/Header'
import Row from '../components/audio/Row'
import RowInfo from '../components/audio/RowInfo'
import Loading from '../components/audio/Loading'
import isObjectEqual from '../utils/isObjectEqual'

class NewsFeed extends Component {
  componentWillMount() {
    if (!window.newsFeedIgnoreFetch) {
      this.props.dispatch({ type: WATCH_NEWSFEED })
    }
  }

  componentWillUnmount() {
    window.newsFeedIgnoreFetch = true
  }

  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  get groupedNewsFeed() {
    const { list, profiles } = this.props.newsFeed.toObject(),
          groupedByDate = list.groupBy((a) => {
            return a.get('date')
          })

    return groupedByDate.map((audios, date) => {
      const groupedById = audios.groupBy((a) => {
        return a.get('sourceId')
      })

      return groupedById.map((items, sourceId) => {
        const profile = profiles.find((p) => {
          return p.get('uid') === parseInt(sourceId)
        })

        return { profile, items, date }
      }).toList()
    }).toList()
  }

  render() {
    const { onPause, onResume, onSongSelect, newsFeed, onControls, player } = this.props,
          { currentAid, currentStatus } = player.toObject(),
          { count, isLoading } = newsFeed.toObject(),
          tbody = this.groupedNewsFeed.map((profiles) =>
            profiles.map((profile, indexProfile) => [
              el(RowInfo, { newsFeed: profile, index: indexProfile, count: profile.items.size, key: indexProfile }),

              profile.items.map((song, indexItem) =>
                onControls(song.get('aid'), song.get('status')).play &&
                  el(Row, {
                    key: song.get('aid'),
                    song,
                    cls: 'play',
                    index: indexItem,
                    clickHandler: onSongSelect
                  }) ||
                onControls(song.get('aid'), song.get('status')).pause &&
                  el(Row, {
                    key: song.get('aid'),
                    song,
                    cls: 'pause',
                    index: indexItem,
                    clickHandler: onPause
                  }) ||
                onControls(song.get('aid'), song.get('status')).resume &&
                  el(Row, {
                    key: song.get('aid'),
                    song,
                    cls: 'play',
                    index: indexItem,
                    clickHandler: onResume
                  })
              )
            ])
          )

    return (
      el('section', { className: 'songs is-paddingless section' },
        el(Header, { count }),
        el('div', { className: 'track-content' },
          el('div', { className: 'list' },
            el('table', { className: 'table is-marginless news-feed' },
              el('tbody', {}, tbody)
            ),
            el(Loading, { isLoading })
          )
        )
      )
    )
  }
}

NewsFeed.propTypes = {
  dispatch: T.func.isRequired,
  newsFeed: I.mapContains({
    count: T.number.isRequired,
    isLoading: T.bool.isRequired,
    profiles: I.listOf(
      I.mapContains({
        firstName: T.string.isRequired,
        lastName: T.string.isRequired,
        photoMediumRec: T.string.isRequired
      })
    ).isRequired,
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
    ).isRequired
  }).isRequired,
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongSelect: T.func.isRequired,
  onControls: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    newsFeed: state.get('newsFeed'),
    player: state.get('player')
  }
}

export default connect(mapStateToProps)(NewsFeed)
