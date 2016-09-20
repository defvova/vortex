import { expect } from 'chai'
import { Map } from 'immutable'
import song from '../../app/reducers/song'
import {
  SONG_PLAYED,
  SONG_STOPPED,
  SONG_PAUSED,
  SONG_PLAYING,
  SET_SONG_POSITION,
  SONG_PREV
} from '../../app/actions/song'

const state = Map({
  url: '',
  aid: null,
  title: '---- ---- ----',
  artist: '---- ----',
  position: 0,
  elapsed: 0,
  duration: 0,
  playFromPosition: 0,
  volume: 100,
  playStatus: 'STOPPED',
  songIndex: -1,
  bytesLoaded: 0
})

describe('reducers', () => {
  describe('song', () => {
    describe('initial state', () => {
      const s = song(undefined, {})

      it('should handle url', () => {
        expect(s.get('url')).to.equal(state.get('url'))
      })

      it('should handle aid', () => {
        expect(s.get('aid')).to.equal(state.get('aid'))
      })

      it('should handle title', () => {
        expect(s.get('title')).to.equal(state.get('title'))
      })

      it('should handle artist', () => {
        expect(s.get('artist')).to.equal(state.get('artist'))
      })

      it('should handle position', () => {
        expect(s.get('position')).to.equal(state.get('position'))
      })

      it('should handle elapsed', () => {
        expect(s.get('elapsed')).to.equal(state.get('elapsed'))
      })

      it('should handle duration', () => {
        expect(s.get('duration')).to.equal(state.get('duration'))
      })

      it('should handle playFromPosition', () => {
        expect(s.get('playFromPosition')).to.equal(state.get('playFromPosition'))
      })

      it('should handle volume', () => {
        expect(s.get('volume')).to.equal(state.get('volume'))
      })

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal(state.get('playStatus'))
      })

      it('should handle songIndex', () => {
        expect(s.get('songIndex')).to.equal(state.get('songIndex'))
      })

      it('should handle bytesLoaded', () => {
        expect(s.get('bytesLoaded')).to.equal(state.get('bytesLoaded'))
      })
    })

    describe('SONG_PLAYED', () => {
      const s = song(state, {
        currentSong: Map({
          url: 'test.com',
          aid: 'test',
          title: 'test',
          artist: 'test',
          position: 0,
          playStatus: 'STOPPED'
        }),
        index: 10,
        type: SONG_PLAYED
      })

      it('should handle url', () => {
        expect(s.get('url')).to.equal('test.com')
      })

      it('should handle aid', () => {
        expect(s.get('aid')).to.equal('test')
      })

      it('should handle title', () => {
        expect(s.get('title')).to.equal('test')
      })

      it('should handle artist', () => {
        expect(s.get('artist')).to.equal('test')
      })

      it('should handle position', () => {
        expect(s.get('position')).to.equal(0)
      })

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal('PLAYING')
      })

      it('should handle index', () => {
        expect(s.get('songIndex')).to.equal(10)
      })
    })

    describe('SONG_STOPPED', () => {
      const s = song(state, { type: SONG_STOPPED })

      it('should handle url', () => {
        expect(s.get('url')).to.equal('')
      })

      it('should handle aid', () => {
        expect(s.get('aid')).to.equal(null)
      })

      it('should handle position', () => {
        expect(s.get('position')).to.equal(0)
      })

      it('should handle elapsed', () => {
        expect(s.get('elapsed')).to.equal(0)
      })

      it('should handle playFromPosition', () => {
        expect(s.get('playFromPosition')).to.equal(0)
      })

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal('STOPPED')
      })
    })

    describe('SONG_PAUSED', () => {
      const s = song(state, { type: SONG_PAUSED })

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal('PAUSED')
      })
    })

    describe('SONG_PLAYING', () => {
      const s = song(state, { type: SONG_PLAYING })

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal('PLAYING')
      })
    })

    describe('SET_SONG_POSITION', () => {
      const s = song(state, {
        type: SET_SONG_POSITION,
        position: 100,
        elapsed: 50,
        duration: 500
      })

      it('should handle position', () => {
        expect(s.get('position')).to.equal(100)
      })

      it('should handle elapsed', () => {
        expect(s.get('elapsed')).to.equal(50)
      })

      it('should handle duration', () => {
        expect(s.get('duration')).to.equal(500)
      })
    })

    describe('SONG_PREV', () => {
      const s = song(state, {
        currentSong: Map({
          url: 'test.com',
          aid: 'test',
          title: 'test',
          artist: 'test',
          position: 0,
          playStatus: 'STOPPED'
        }),
        index: 10,
        type: SONG_PREV
      })

      it('should handle url', () => {
        expect(s.get('url')).to.equal('test.com')
      })

      it('should handle aid', () => {
        expect(s.get('aid')).to.equal('test')
      })

      it('should handle title', () => {
        expect(s.get('title')).to.equal('test')
      })

      it('should handle artist', () => {
        expect(s.get('artist')).to.equal('test')
      })

      it('should handle position', () => {
        expect(s.get('position')).to.equal(0)
      })

      it('should handle elapsed', () => {
        expect(s.get('elapsed')).to.equal(0)
      })

      it('should handle duration', () => {
        expect(s.get('duration')).to.equal(0)
      })

      it('should handle playFromPosition', () => {
        expect(s.get('playFromPosition')).to.equal(0)
      })

      it('should handle volume', () => {
        expect(s.get('volume')).to.equal(100)
      })

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal('PLAYING')
      })
    })
  })
})
