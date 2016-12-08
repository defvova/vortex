import configStore from '../utils/configstore'
import vk from '../api/provider/vk'
import { STATUS } from '../constants'

const { token, ownerId } = configStore.get('vk') || {}

vk.setToken(token)

export const getSourceIds = () => { // eslint-disable-line one-var
        return vk.get('friends.get', { user_id: ownerId })
      },

      getNewsFeed = (ids) => {
        const response = vk.get('newsfeed.get', { filters: 'audio', source_ids: ids.join() }).then(({
          profiles,
          items
        }) => {
          const status = STATUS.stopped,
                filterItems = items.filter(({ type }) => {
                  if (type != 'audio') {
                    return false
                  }

                  return true
                }),
                list = filterItems.map(({ audio, date, source_id }) => {
                  audio.shift()
                  return audio.filter(({ url }) => {
                    if (!url) {
                      return false
                    }

                    return true
                  }).map(({ aid, artist, title, url, duration }) => {
                    return { aid, artist, title, url, duration, status, howlId: null, date, sourceId: source_id }
                  })
                }).reduce((prev, curr) => {
                  return prev.concat(curr)
                }, []),
                mapProfiles = profiles.map(({ first_name, last_name, photo_medium_rec, uid }) => {
                  return {
                    firstName: first_name,
                    lastName: last_name,
                    photoMediumRec: photo_medium_rec,
                    uid
                  }
                })

          return { list, profiles: mapProfiles }
        })

        return response
      }
