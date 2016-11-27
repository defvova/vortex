import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames'
import { ipcRenderer } from 'electron'

class Header extends Component {
  constructor(props) {
    super(props)

    this.isPopoverActive = props.isMenuActive
    this.state = {
      isMenuActive: props.isMenuActive
    }

    this.handleVkLogin = this.handleVkLogin.bind()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((this.props.count !== nextProps.count) || this.state.isMenuActive !== nextState.isMenuActive)
  }

  componentWillMount() {
    document.addEventListener('click', (e) => {
      const klass = e.target.getAttribute('class'),
            isActive = false

      this.isPopoverActive && !(klass === 'fa fa-ellipsis-v' || klass === 'icon menu') && this.handleMenu(isActive)
    })
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
      <div className={`menu-popover ${active}`}>
        <aside className='menu has-text-left'>
          <ul className='menu-list'>
            <li>
              <a>
                <span className='icon is-small'>
                  <i className='fa fa-cogs' />
                </span>
                <span>Налаштування</span>
              </a>
            </li>
            <li>
              <a>
                <span className='icon is-small'>
                  <i className='fa fa-sign-out' />
                </span>
                <span>Вийти</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    )
  }

  render() {
    const { isMenuActive } = this.state,
          { count } = this.props

    return (
      <nav className='nav'>
        <div className='nav-left left-actions'>
          <div className='nav-item search'>
            <p className='control has-icon'>
              <input className='input' type='text' placeholder='Пошук по аудіозаписах' />
              <i className='fa fa-search' />
            </p>
          </div>
          <div className='nav-item'>
            <h4>Found {count} recordings</h4>
          </div>
        </div>
        <div className='nav-right'>
          <a className='nav-item' onClick={this.handleVkLogin}>
            <span className='icon'>
              <i className='fa fa-vk' />
            </span>
          </a>
          <a className='nav-item' onClick={this.handleMenu.bind(this, !isMenuActive)}>
            <span className='icon menu'>
              <i className='fa fa-ellipsis-v' />
            </span>
          </a>
          {this.renderPopover()}
        </div>
      </nav>
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
