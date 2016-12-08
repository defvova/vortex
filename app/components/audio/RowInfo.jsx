import React, { Component, PropTypes as T, createElement as el } from 'react'
import I from 'react-immutable-proptypes'
import timeConverter from '../../utils/timeConverter'
import isObjectEqual from '../../utils/isObjectEqual'

class RowInfo extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isObjectEqual(this.props, nextProps)) {
      return true
    }

    return false
  }

  render() {
    const { newsFeed, index, count } = this.props,
          date = newsFeed.date,
          { photoMediumRec, firstName, lastName } = newsFeed.profile.toObject()

    return (
      el('tr', { key: index, className: 'feed-row' },
        el('td', {},
          el('figure', { className: 'image is-48x48' },
            el('img', { src: photoMediumRec })
          )
        ),
        el('td', { className: 'feed-info' },
          el('b', {}, firstName, lastName),
          ' додала ', count, ' аудіозаписів ', timeConverter(date)
        ),
        el('td')
      )
    )
  }
}

RowInfo.propTypes = {
  index: T.number.isRequired,
  count: T.number.isRequired,
  newsFeed: T.shape({
    profile: I.mapContains({
      photoMediumRec: T.string.isRequired,
      firstName: T.string.isRequired,
      lastName: T.string.isRequired
    }).isRequired,
    date: T.number.isRequired
  }).isRequired
}

export default RowInfo
