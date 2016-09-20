export const SONG_PLAYED = 'SONG_PLAYED',
      SONG_STOPPED = 'SONG_STOPPED',
      SONG_PAUSED = 'SONG_PAUSED',
      SONG_PLAYING = 'SONG_PLAYING',
      SET_SONG_POSITION = 'SET_SONG_POSITION',
      SONG_NEXT = 'SONG_NEXT',
      SONG_PREV = 'SONG_PREV',
      SET_PLAY_FROM_POSITION = 'SET_PLAY_FROM_POSITION',
      SET_BYTES_LOADED = 'SET_BYTES_LOADED'

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

export function updateSongPosition(elapsed, duration, position) {
  return {
    type: SET_SONG_POSITION,
    elapsed,
    duration,
    position
  }
}

export function updatePlayFromPosition(position) {
  return {
    type: SET_PLAY_FROM_POSITION,
    position
  }
}

export function updateBytesLoaded(bytesLoaded) {
  return {
    type: SET_BYTES_LOADED,
    bytesLoaded
  }
}
