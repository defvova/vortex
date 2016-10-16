import configStore from '../utils/configstore'
import vk from '../api/provider/vk'

export const REQUEST_AUDIOS = 'REQUEST_AUDIOS',
      RECEIVE_AUDIOS = 'RECEIVE_AUDIOS',
      UPDATE_STATUS = 'UPDATE_STATUS',
      UPDATE_LOOP = 'UPDATE_LOOP',
      UPDATE_SHUFFLE = 'UPDATE_SHUFFLE',
      STATUS = {
        stopped: 'stopped',
        playing: 'playing',
        paused: 'paused'
      }

const vkConfig = configStore.get('vk') || {}, // eslint-disable-line one-var
      token = vkConfig.access_token,
      ownerId = vkConfig.user_id

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

function receiveAudios(count, list, step, offset) {
  return { type: RECEIVE_AUDIOS, count, list, step, offset }
}

export function fetchAudios(step = 0, maxCount = 50) {
  return function(dispatch) {
    dispatch(requestAudios())

    const list = [],
          offset = maxCount * step
    let nextStep = step

    nextStep += 1
    vk.setToken(token)
    vk.get('audio.get', { owner_id: ownerId, offset, count: maxCount }).then(([count, ...audios]) => {

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
      dispatch(receiveAudios(count, list, nextStep, maxCount))
    })
  }
}
