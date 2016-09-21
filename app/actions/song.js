export const SONG_PLAYED = 'SONG_PLAYED',
      SONG_STOPPED = 'SONG_STOPPED',
      SONG_PAUSED = 'SONG_PAUSED',
      SONG_PLAYING = 'SONG_PLAYING',
      SONG_NEXT = 'SONG_NEXT',
      SONG_PREV = 'SONG_PREV'

export function songPlayed(song, index) {
  return {
    type: SONG_PLAYED,
    song,
    index
  }
}

export function songNext(song, count, index) {
  return {
    type: SONG_NEXT,
    song,
    index,
    count
  }
}

export function songPrev(song, index) {
  return {
    type: SONG_PREV,
    song,
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
