export const SONG_PLAYED = 'SONG_PLAYED',
      SONG_STOPPED = 'SONG_STOPPED',
      SONG_PAUSED = 'SONG_PAUSED',
      SONG_PLAYING = 'SONG_PLAYING',
      SET_SONG_POSITION = 'SET_SONG_POSITION',
      SONG_NEXT = 'SONG_NEXT',
      SONG_PREV = 'SONG_PREV'

export function songPlayed(currentSong, index) {
  return {
    type: SONG_PLAYED,
    currentSong,
    index
  }
}

export function songNext(currentSong, count, index) {
  return {
    type: SONG_NEXT,
    currentSong,
    index,
    count
  }
}

export function songPrev(currentSong, index) {
  return {
    type: SONG_PREV,
    currentSong,
    index
  }
}

export function songStopped() {
  return {
    type: SONG_STOPPED
  }
}

export function songPaused() {
  return {
    type: SONG_PAUSED
  }
}

export function songPlaying() {
  return {
    type: SONG_PLAYING
  }
}

export function updateSongPosition(position) {
  return {
    type: SET_SONG_POSITION,
    position
  }
}
