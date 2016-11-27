import configStore from '../utils/configstore'
import { getHowl, howl } from '../utils/howl'
import vk from '../api/provider/vk'

const { token } = configStore.get('vk') || {}

vk.setToken(token)

export const getNextIndex = (isShuffle, size, count, currentIndex) => { // eslint-disable-line one-var
        let i = currentIndex,
            index = null

        if (isShuffle) {
          index = Math.floor(Math.random() * size)
        } else {
          i += 1
          index = Math.min(count, i)
        }

        return index
      },

      getPrevIndex = (isShuffle, size, currentIndex) => {
        let i = currentIndex,
            index = null

        if (isShuffle) {
          index = Math.floor(Math.random() * size)
        } else {
          i -= 1
          index = Math.max(0, i)
        }

        return index
      },

      playHowl = (url, isLoop, onSongNext, onStep, onBytesLoaded) => {
        return howl(url, isLoop, onSongNext, onStep, onBytesLoaded).play()
      },

      pauseHowl = (howlId) => {
        return getHowl(howlId).pause()
      },

      stopHowl = (howlId) => {
        return getHowl(howlId) && getHowl(howlId).stop()
      },

      loopHowl = (howlId, isLoop) => {
        return getHowl(howlId) && getHowl(howlId).loop(!isLoop)
      },

      resumeHowl = (howlId) => {
        return getHowl(howlId).play()
      }
