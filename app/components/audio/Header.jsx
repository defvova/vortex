import React, { Component, PropTypes as T, createElement as el } from 'react'
import classNames from 'classnames'
import { ipcRenderer } from 'electron'
import { fromJS } from 'immutable'
import isObjectEqual from '../../utils/isObjectEqual'

class Header extends Component {
  constructor(props) {
    super(props)

    this.isPopoverActive = props.isMenuActive
    this.state = {
      isMenuActive: props.isMenuActive
    }
  }

  componentWillMount() {
    document.addEventListener('click', (e) => {
      const klass = e.target.getAttribute('class'),
            isActive = false

      this.isPopoverActive && !(klass === 'fa fa-ellipsis-v' || klass === 'icon menu') && this.handleMenu(isActive)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isObjectEqual(nextProps, this.props)) {
      return true
    }

    if (!isObjectEqual(nextState, this.state)) {
      return true
    }

    return false
  }

  handleVkLogin = () => {
    ipcRenderer.send('get-vk-permission')
  }

  handleMenu = (isMenuActive) => {
    this.isPopoverActive = isMenuActive
    this.setState({ isMenuActive })
  }

  renderPopover = () => {
    const { isMenuActive } = this.state,
          active = classNames({
            'active': isMenuActive
          })

    return (
      el('div', { className: `menu-popover ${active}` },
        el('aside', { className: 'menu has-text-left' },
          el('ul', { className: 'menu-list' },
            el('li', {},
              el('a', {},
                el('span', { className: 'icon is-small' },
                  el('i', { className: 'fa fa-cogs' })
                ),
                el('span', {}, 'Налаштування')
              )
            ),
            el('li', {},
              el('a', {},
                el('span', { className: 'icon is-small' },
                  el('i', { className: 'fa fa-sign-out' })
                ),
                el('span', {}, 'Вийти')
              )
            )
          )
        )
      )
    )
  }

  render() {
    const { isMenuActive } = this.state,
          { count } = this.props

    return (
      el('nav', { className: 'nav' },
        el('div', { className: 'nav-left left-actions' },
          el('div', { className: 'nav-item search' },
            el('p', { className: 'control has-icon' },
              el('input', { className: 'input', type: 'text', placeholder: 'Пошук по аудіозаписах' }),
              el('i', { className: 'fa fa-search'})
            )
          ),
          el('div', { className: 'nav-item' },
            el('h4', {}, 'Found ', count, ' recordings')
          )
        ),
        el('div', { className: 'nav-right' },
          el('a', { className: 'nav-item', onClick: this.handleVkLogin },
            el('span', { className: 'icon' },
              el('i', { className: 'fa fa-vk' })
            )
          ),
          el('a', { className: 'nav-item', onClick: this.handleMenu.bind(this, !isMenuActive) },
            el('span', { className: 'icon menu' },
              el('i', { className: 'fa fa-ellipsis-v' })
            )
          ),
          this.renderPopover()
        )
      )
    )
  }
}

Header.propTypes = {
  isMenuActive: T.bool.isRequired,
  count: T.number.isRequired
}

Header.defaultProps = {
  isMenuActive: false
}

export default Header
