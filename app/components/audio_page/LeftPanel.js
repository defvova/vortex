import React, { Component } from 'react'

class LeftPanel extends Component {
  render() {
    return (
      <section className='hero is-dark'>
        <div className='hero-body is-paddingless'>
          <div className='container'>
            <aside className='menu'>
              <ul className='menu-list'>
                <li>
                  <a href='#' className='is-active'>
                    <span className='icon is-small'>
                      <i className='fa fa-tags' />
                    </span>
                    <span>Мої аудіозаписи</span>
                  </a>
                </li>
                <li>
                  <a href='#'>
                    <span className='icon is-small'>
                      <i className='fa fa-user-secret' />
                    </span>
                    <span>Оновлення друзів</span>
                  </a>
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

export default LeftPanel
