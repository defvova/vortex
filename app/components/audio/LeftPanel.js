import React, { Component, PropTypes as T } from 'react'
import Link from 'react-router/lib/Link'
import classNames from 'classnames'

class LeftPanel extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.getCurrentStateName !== nextProps.getCurrentStateName
  }

  activeLink = (path) => {
    return classNames({
      'is-active': this.props.getCurrentStateName === path
    })
  }

  render() {
    return (
      <section className='hero is-dark'>
        <div className='hero-body is-paddingless'>
          <div className='container'>
            <aside className='menu'>
              <ul className='menu-list'>
                <li>
                  <Link to='/' className={this.activeLink('favourite')}>
                    <span className='icon is-small'>
                      <i className='fa fa-tags' />
                    </span>
                    <span>Мої аудіозаписи</span>
                  </Link>
                </li>
                <li>
                  <Link to='/newsFeed' className={this.activeLink('newsFeed')}>
                    <span className='icon is-small'>
                      <i className='fa fa-user-secret' />
                    </span>
                    <span>Оновлення друзів</span>
                  </Link>
                </li>
                <li>
                  <a href='#'>
                    <span className='icon is-small'>
                      <i className='fa fa-headphones' />
                    </span>
                    <span>Рекомендації</span>
                  </a>
                </li>
                <li>
                  <a href='#'>
                    <span className='icon is-small'>
                      <i className='fa fa-cloud' />
                    </span>
                    <span>Популярне</span>
                  </a>
                </li>
                <li>
                  <a href='#'>
                    <span className='icon is-small'>
                      <i className='fa fa-bookmark' />
                    </span>
                    <span>Мої альбоми</span>
                  </a>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    )
  }
}

LeftPanel.propTypes = {
  getCurrentStateName: T.string.isRequired
}

export default LeftPanel
