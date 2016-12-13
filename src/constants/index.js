import createConstants from '../utils/createConstants'
import extendConstants from '../utils/extendConstants'

export default extendConstants(createConstants(
  'FAVOURITE_REQUEST',
  'FAVOURITE_RECEIVE',
  'FAVOURITE_RECEIVE_FAILED',
  'FAVOURITE_UPDATE_STATUS',
  'FAVOURITE_SONG_NEXT',
  'FAVOURITE_SONG_STOP',

  'NEWSFEED_REQUEST',
  'NEWSFEED_RECEIVE',
  'NEWSFEED_RECEIVE_FAILED',
  'NEWSFEED_UPDATE_STATUS',
  'NEWSFEED_SONG_NEXT',
  'NEWSFEED_SONG_STOP',

  'UPDATE_LOOP',
  'UPDATE_SHUFFLE',
  'UPDATE_PLAYER',

  'WATCH_UPDATE_LOOP',
  'WATCH_UPDATE_SHUFFLE',
  'WATCH_PLAY_SONG',
  'WATCH_PAUSE_SONG',
  'WATCH_NEXT_SONG',
  'WATCH_PREV_SONG',
  'WATCH_SELECT_SONG',
  'WATCH_RESUME_SONG',

  'WATCH_FAVOURITE',

  'WATCH_NEWSFEED'
), {
  'STATUS': {
    stopped: 'stopped',
    playing: 'playing',
    paused: 'paused'
  }
})
