import configStore from '../utils/configstore'
import vk from '../api/provider/vk'
import { STATUS } from '../reducers/player'

const { token, ownerId } = configStore.get('vk') || {}

vk.setToken(token)

export const getFavourite = (step = 0) => { // eslint-disable-line one-var
  const maxCount = 50,
        offset = maxCount * step,
        options = { owner_id: ownerId, offset, count: maxCount }

  let nextStep = step

  nextStep += 1

  const response = vk.get('audio.get', options).then(([count, ...audios]) => { // eslint-disable-line one-var
    const status = STATUS.stopped,
          list = audios.map(({ aid, artist, title, url, duration }) => {
            return { aid, artist, title, url, duration, status, howlId: null }
          })

    return { list, count, step: nextStep, offset: maxCount }
  })

  return response
}
