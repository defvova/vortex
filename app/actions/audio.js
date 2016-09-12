import configStore from '../utils/configstore'
import vk from '../api/provider/vk'

export const REQUEST_AUDIOS = 'REQUEST_AUDIOS'
export const RECEIVE_AUDIOS = 'RECEIVE_AUDIOS'

const vkConfig = configStore.get('vk')
const token = vkConfig.access_token
const owner_id = vkConfig.user_id

function requestAudios() {
  return {
    type: REQUEST_AUDIOS
  }
}

function receiveAudios(count, list) {
  return {
    type: RECEIVE_AUDIOS,
    count: count,
    list: list
  }
}

export function fetchAudios(params = {}) {
  return function(dispatch) {
    dispatch(requestAudios())

    vk.setToken(token)
    vk.get('audio.get', { owner_id: owner_id }).then(([count, ...audios]) => {
      dispatch(receiveAudios(count, audios))
    })
  }
}
