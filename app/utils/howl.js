export const getHowl = (id) => {
        const howles = window.Howler._howls.filter((howl) => {
          return howl._sounds[0]._id === id
        })

        return howles[0]
      },

      getSound = (id) => {
        return getHowl(id)._sounds[0]._node
      },

      howlBytesLoaded = (id, duration) => {
        const howl = getHowl(id),
              { buffered, currentTime } = getSound(id),
              seek = howl.seek()

        let range = 0

        while (
          buffered.length > range + 1 &&
          !(buffered.start(range) <= currentTime &&
          currentTime <= buffered.end(range))
        ) {
          range += 1
        }

        const loadStartPercentage =  // eslint-disable-line one-var
                buffered.length != 0 && buffered.start(range) / duration,
              loadEndPercentage =
                buffered.length != 0 && buffered.end(range) / duration,
              loaded = loadEndPercentage - loadStartPercentage,
              bytesLoaded = (loaded + (seek / duration)) * 100

        return bytesLoaded
      },

      muteHowl = (params) => {
        let volume = null,
            prevVolume = null

        window.Howler.mute(!params.isMute)

        if (params.isMute) {
          volume = params.prevVolume
          prevVolume = params.prevVolume
        } else {
          volume = 0
          prevVolume = params.volume
        }

        return { volume, prevVolume }
      }
