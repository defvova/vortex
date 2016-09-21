import { expect } from 'chai'
import { Map } from 'immutable'
import song from '../../app/reducers/song'
import {
  SONG_PLAYED,
  SONG_STOPPED,
  SONG_PAUSED,
  SONG_PLAYING,
  SONG_PREV
} from '../../app/actions/song'

const state = Map({
  url: '',
  aid: null,
  title: '---- ---- ----',
  artist: '---- ----',
  playStatus: 'STOPPED',
  songIndex: -1
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

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal(state.get('playStatus'))
      })

      it('should handle songIndex', () => {
        expect(s.get('songIndex')).to.equal(state.get('songIndex'))
      })
    })

    describe('SONG_PLAYED', () => {
      const s = song(state, {
        song: Map({
          url: 'test.com',
          aid: 'test',
          title: 'test',
          artist: 'test',
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

    describe('SONG_PREV', () => {
      const s = song(state, {
        song: Map({
          url: 'test.com',
          aid: 'test',
          title: 'test',
          artist: 'test',
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

      it('should handle playStatus', () => {
        expect(s.get('playStatus')).to.equal('PLAYING')
      })
    })
  })
})
