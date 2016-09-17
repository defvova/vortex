import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import auth from './app/api/provider/auth'
import configStore from './app/utils/configstore'
import { VK_APP_ID, VK_SCOPE, VK_REVOKE } from './app/api/config'

let mainWindow = null

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'),
          extensions = [
            'REACT_DEVELOPER_TOOLS',
            'REDUX_DEVTOOLS'
          ],
          forceDownload = !!process.env.UPGRADE_EXTENSIONS

    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload)
      } catch (e) {} // eslint-disable-line no-empty
    }
  }
}

app.on('ready', async () => {
  await installExtensions()

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  })

  mainWindow.loadURL(`file://${__dirname}/app/app.html`)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    // configStore.clear()
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y)
        }
      }]).popup(mainWindow)
    })
  }

  ipcMain.on('get-vk-permission', () => {
    auth({
      appId: VK_APP_ID,
      scope: VK_SCOPE,
      revoke: VK_REVOKE
    }, {
      parent: mainWindow
    }).then((res) => {
      configStore.set('vk', res)
    }).catch((err) => {
      console.error(err) // eslint-disable-line no-console
    })
  })
})
