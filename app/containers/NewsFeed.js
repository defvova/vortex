import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { WATCH_NEWSFEED } from '../sagas/newsFeed'
import { timeConverter } from '../utils/time'
import Header from '../components/audio/Header'

class NewsFeed extends Component {
  componentWillMount() {
    if (!window.newsFeedIgnoreFetch) {
      this.props.dispatch({ type: WATCH_NEWSFEED })
    }
  }

  componentWillUnmount() {
    window.newsFeedIgnoreFetch = true
  }

  info = (profile, index, count) => {
    return (
      <tr key={index} className='feed-row'>
        <td>
          <figure className='image is-48x48'>
            <img src={profile.photoMediumRec} />
          </figure>
        </td>
        <td className='feed-info'>
          <b>{profile.firstName} {profile.lastName} </b>
          додала {count} аудіозаписів {timeConverter(profile.date)}
        </td>
        <td></td>
      </tr>
    )
  }

  get groupedNewsFeed() {
    const { list, profiles } = this.props.newsFeed.toObject(),
          groupedByDate = list.groupBy((audio) => {
            return audio.get('date')
          })

    return groupedByDate.map((audios, date) => {
      const groupedById = audios.groupBy((audio) => {
        return audio.get('sourceId')
      })

      return groupedById.map((items, sourceId) => {
        const profile = profiles.find((profile) => profile.get('uid') === sourceId),
              { firstName, lastName, photoMediumRec } = profile.toObject()

        return { firstName, lastName, photoMediumRec, items, date }
      }).toList()
    }).toList()
  }

  render() {
    const { onPause, onResume, onSongSelect, newsFeed, onRenderLoading, onControls, onRow } = this.props,
          { count, isLoading } = newsFeed.toObject(),
          tbody = this.groupedNewsFeed.map((profiles) =>
            profiles.map((profile, indexProfile) => [
              this.info(profile, indexProfile, profile.items.size),

              profile.items.map((song, indexItem) =>
                onControls(
                  song.get('aid'),
                  song.get('status')).play && onRow(song, 'play', indexItem, onSongSelect.bind(this, song.get('aid'))
                ) ||
                onControls(
                  song.get('aid'),
                  song.get('status')).pause && onRow(song, 'pause', indexItem, onPause.bind()
                ) ||
                onControls(
                  song.get('aid'),
                  song.get('status')).resume && onRow(song, 'play', indexItem, onResume.bind()
                )
              )
            ])
          )

    return (
      <section className='songs is-paddingless section'>
        <Header count={count} />
        <div className='track-content'>
          <div className='list'>
            <table className='table is-marginless news-feed'>
              <tbody>
                {tbody}
              </tbody>
            </table>
            {onRenderLoading(isLoading)}
          </div>
        </div>
      </section>
    )
  }
}

NewsFeed.propTypes = {
  dispatch: T.func.isRequired,
  newsFeed: I.mapContains({
    count: T.number.isRequired,
    isLoading: T.bool.isRequired
  }).isRequired,
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onSongSelect: T.func.isRequired,
  onRenderLoading: T.func.isRequired,
  onControls: T.func.isRequired,
  onRow: T.func.isRequired
}

function mapStateToProps(state) {
  const { newsFeed } = state.toObject()

  return { newsFeed }
}

export default connect(mapStateToProps)(NewsFeed)
