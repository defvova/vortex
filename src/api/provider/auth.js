/**
 * Options
 *
 * appId: your app id
 * scope: required scope
 * display [popup]: display type, one of the following: page, popup, mobile
 * revoke: whether to ask users for permissions every time
 *
 * Window Options
 *
 * width: 1024
 * height: 720
 * parent: win // main application window
 * minimizable: false
 * maximizable: false
 * resizable: false
 */

import url from 'url'
import qs from 'querystring'
import { BrowserWindow } from 'electron'
import Promise from 'bluebird'
import { VK_AUTHORIZE_URL, VK_REDIRECT_URL } from '../config'

function auth(options, windowOptions) {
  if (!options.appId) {
    return Promise.reject(new Error('App id is not specified'))
  }

  const opts = {
          authorizeUrl: VK_AUTHORIZE_URL,
          redirectUri: VK_REDIRECT_URL,
          display: 'popup',
          scope: null,
          revoke: false,
          ...options
        },
        windowOpts = {
          height: 430,
          width: 655,
          ...windowOptions
        },
        state = (Date.now().toString(36) + (Math.random() * 0x10000).toString(36).substr(2, 5)).toUpperCase(),
        response_type = 'token', // eslint-disable-line camelcase
        query = qs.stringify({
          state,
          response_type,
          client_id: opts.appId,
          scope: opts.scope,
          display: opts.display,
          revoke: opts.revoke ? 1 : 0,
          redirect_uri: opts.redirectUri
        }),
        vkUrl = `${opts.authorizeUrl}?${query}`,
        win = new BrowserWindow(windowOpts)

  win.loadURL(vkUrl)

  return new Promise((resolve, reject) => {
    win.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      const data = url.parse(newUrl)

      // http://stackoverflow.com/questions/16733863/oauth2-0-implicit-grant-flow-why-use-url-hash-fragments
      if (`${data.protocol}//${data.host}${data.pathname}` === opts.redirectUri && data.hash) {
        const query = qs.parse(data.hash.substring(1))

        if (!('state' in query && query.state === String(state))) {
          reject(new Error(`Incorrect state: expected ${query.state} to equal ${state}`))
        } else if ('error' in query) {
          reject(new Error(query.error_description))
        } else if ('access_token' in query && 'user_id' in query && 'expires_in' in query) {
          resolve(query)
        } else {
          reject(new Error('No access token or error is available'))
        }
        win.destroy()
      }
    })

    win.on('closed', () => {
      reject(new Error('Auth window was closed before completing authentication'))
    })
  })
}

export default auth
