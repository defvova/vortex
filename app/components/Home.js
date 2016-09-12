import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styles from './Home.css'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { ipcRenderer } from 'electron'
import { fetchAudios } from '../actions/audio'

class Home extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(fetchAudios())
  }

  handle = () => {
    ipcRenderer.send('get-vk-permission')
  }

  render() {
    const { audio } = this.props

    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link>
          <br />
          <a onClick={this.handle}>Login via Vk</a>
          <br />
          <table>
            <thead>
              <tr>
                <th>Aid</th>
                <th>OwnerId</th>
                <th>Artist</th>
                <th>Title</th>
                <th>Duration</th>
                <th>Url</th>
                <th>Genre</th>
              </tr>
            </thead>
            <tbody>
              {audio.get('list').map((item, index) =>
                <tr key={index}>
                  <td>{item.get('aid')}</td>
                  <td>{item.get('owner_id')}</td>
                  <td>{item.get('artist')}</td>
                  <td>{item.get('title')}</td>
                  <td>{item.get('duration')}</td>
                  <td>{item.get('url')}</td>
                  <td>{item.get('genre')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  audio: ImmutablePropTypes.mapContains({
    list: ImmutablePropTypes.list.isRequired,
    count: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired
  }),
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { audio } = state
  return { audio }
}

export default connect(mapStateToProps)(Home)
