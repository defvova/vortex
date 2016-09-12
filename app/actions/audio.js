import configStore from '../utils/configstore'
import vk from '../api/provider/vk'

export const REQUEST_AUDIOS = 'REQUEST_AUDIOS',
      RECEIVE_AUDIOS = 'RECEIVE_AUDIOS'

const vkConfig = configStore.get('vk') || {}, // eslint-disable-line one-var
      token = vkConfig.access_token,
      ownerId = vkConfig.user_id

function requestAudios() {
  return {
    type: REQUEST_AUDIOS
  }
}

function receiveAudios(count, list) {
  return { type: RECEIVE_AUDIOS, count, list }
}

export function fetchAudios() {
  return function(dispatch) {
    dispatch(requestAudios())

    vk.setToken(token)
    vk.get('audio.get', { owner_id: ownerId }).then(([count, ...audios]) => {
      dispatch(receiveAudios(count, audios))
    })
  }
}
