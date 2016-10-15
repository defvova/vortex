import configStore from '../utils/configstore'
import vk from '../api/provider/vk'

export const REQUEST_AUDIOS = 'REQUEST_AUDIOS',
      RECEIVE_AUDIOS = 'RECEIVE_AUDIOS',
      UPDATE_STATUS = 'UPDATE_STATUS',
      UPDATE_LOOP = 'UPDATE_LOOP',
      UPDATE_SHUFFLE = 'UPDATE_SHUFFLE',
      UPDATE_MUTE = 'UPDATE_MUTE',
      STATUS = {
        stopped: 'stopped',
        playing: 'playing',
        paused: 'paused'
      }

const vkConfig = configStore.get('vk') || {}, // eslint-disable-line one-var
      token = vkConfig.access_token,
      ownerId = vkConfig.user_id

export function updateMute(volume, prevVolume) {
  return {
    type: UPDATE_MUTE,
    volume,
    prevVolume
  }
}

export function updateShuffle() {
  return {
    type: UPDATE_SHUFFLE
  }
}

export function updateStatus(index, status) {
  return {
    type: UPDATE_STATUS,
    status,
    index
  }
}

export function updateLoop() {
  return {
    type: UPDATE_LOOP
  }
}

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
      const list = []

      audios.forEach((audio) => {
        list.push({
          aid: audio.aid,
          artist: audio.artist,
          title: audio.title,
          url: audio.url,
          status: STATUS.stopped,
          duration: audio.duration
        })
      })
      dispatch(receiveAudios(count, list))
    })
  }
}
