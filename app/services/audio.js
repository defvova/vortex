import { Howl } from 'howler/dist/howler.min'
import configStore from '../utils/configstore'
import { getHowl } from '../utils/howl'
import vk from '../api/provider/vk'
import { STATUS } from '../reducers/audio'

const howl = (action) => {
  const { url, isLoop, onStep, onBytesLoaded, onSongNext } = action,
        howl = new Howl({
          src: url,
          html5: true,
          loop: isLoop,
          onplay: () => {
            requestAnimationFrame(onStep)
            requestAnimationFrame(onBytesLoaded)
            howl.loop(isLoop)
          },
          onseek: () => {
            requestAnimationFrame(onBytesLoaded)
          },
          onend: () => {
            if (!howl.loop()) {
              onSongNext()
            }
          }
        })

  return howl
}

export const getAudios = (action = {}) => { // eslint-disable-line one-var
        const vkConfig = configStore.get('vk') || {},
              token = vkConfig.access_token,
              ownerId = vkConfig.user_id,
              step = action.step || 0,
              maxCount = 50,
              offset = maxCount * step,
              options = { owner_id: ownerId, offset, count: maxCount }

        let nextStep = step

        nextStep += 1

        vk.setToken(token)

        const response = vk.get('audio.get', options).then(([count, ...audios]) => { // eslint-disable-line one-var
          const status = STATUS.stopped,
                list = audios.map(({ aid, artist, title, url, duration }) => {
                  return { aid, artist, title, url, duration, status, howlId: null }
                })

          return { list, count, step: nextStep, offset: maxCount }
        })

        return response
      },

      getNextIndex = (audio) => {
        const { isShuffle, list, count, currentIndex } = audio,
              size = list.size

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

      getPrevIndex = (audio) => {
        const { currentIndex, isShuffle, list } = audio,
              size = list.size

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

      playHowl = (action) => {
        return howl(action).play()
      },

      pauseHowl = (howlId) => {
        return getHowl(howlId).pause()
      },

      stopHowl = (howlId) => {
        return getHowl(howlId) && getHowl(howlId).stop()
      },

      loopHowl = (action) => {
        const { howlId, isLoop } = action

        return getHowl(howlId) && getHowl(howlId).loop(!isLoop)
      },

      resumeHowl = (howlId) => {
        return getHowl(howlId).play()
      }
