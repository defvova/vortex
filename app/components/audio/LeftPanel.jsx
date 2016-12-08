import React, { Component, PropTypes as T, createElement as el } from 'react'
import Link from 'react-router/lib/Link'
import classNames from 'classnames'

class LeftPanel extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.getCurrentStateName !== nextProps.getCurrentStateName
  }

  render() {
    const activeLink = (path) => {
      return classNames({
        'is-active': this.props.getCurrentStateName === path
      })
    }

    return (
      el('section', { className: 'hero is-dark' },
        el('div', { className: 'hero-body is-paddingless' },
          el('div', { className: 'container' },
            el('aside', { className: 'menu' },
              el('ul', { className: 'menu-list' },
                el('li', {},
                  el(Link, { to: '/', className: activeLink('favourite') },
                    el('span', { className: 'icon is-small' },
                      el('i', { className: 'fa fa-tags' })
                    ),
                    el('span', {}, 'Мої аудіозаписи')
                  )
                ),
                el('li', {},
                  el(Link, { to: '/newsFeed', className: activeLink('newsFeed') },
                    el('span', { className: 'icon is-small' },
                      el('i', { className: 'fa fa-user-secret' })
                    ),
                    el('span', {}, 'Оновлення друзів')
                  )
                ),
                el('li', {},
                  el('a', { href: '#' },
                    el('span', { className: 'icon is-small' },
                      el('i', { className: 'fa fa-headphones' })
                    ),
                    el('span', {}, 'Рекомендації')
                  )
                ),
                el('li', {},
                  el('a', { href: '#' },
                    el('span', { className: 'icon is-small' },
                      el('i', { className: 'fa fa-cloud' })
                    ),
                    el('span', {}, 'Популярне')
                  )
                ),
                el('li', {},
                  el('a', { href: '#' },
                    el('span', { className: 'icon is-small' },
                      el('i', { className: 'fa fa-bookmark' })
                    ),
                    el('span', {}, 'Мої альбоми')
                  )
                )
              )
            )
          )
        )
      )
    )
  }
}

LeftPanel.propTypes = {
  getCurrentStateName: T.string.isRequired
}

export default LeftPanel
