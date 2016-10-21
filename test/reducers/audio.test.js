// import { expect } from 'chai'
// import { Map, List } from 'immutable'
// import audio from '../../app/reducers/audio'
// import { REQUEST_AUDIOS, RECEIVE_AUDIOS } from '../../app/actions/audio'
//
// const state = Map({
//   list: List(),
//   count: 0,
//   isLoading: false
// })
//
// describe('reducers', () => {
//   describe('audio', () => {
//     describe('initial state', () => {
//       const s = audio(undefined, {})
//
//       it('should handle count', () => {
//         expect(s.get('count')).to.equal(state.get('count'))
//       })
//
//       it('should handle isLoading', () => {
//         expect(s.get('isLoading')).to.equal(state.get('isLoading'))
//       })
//
//       it('should handle list', () => {
//         expect(s.get('list')).to.equal(state.get('list'))
//       })
//     })
//
//     describe('REQUEST_AUDIOS', () => {
//       const s = audio(state, { type: REQUEST_AUDIOS })
//
//       it('should handle isLoading', () => {
//         expect(s.get('isLoading')).to.be.true
//       })
//     })
//
//     describe('RECEIVE_AUDIOS', () => {
//       const s = audio(state, { type: RECEIVE_AUDIOS, count: 20, list: [{ id: 1, url: 'test' }] }),
//             a = s.get('list').first()
//
//       it('should handle list', () => {
//         expect(a.get('id')).to.equal(1)
//         expect(a.get('url')).to.equal('test')
//       })
//
//       it('should handle count', () => {
//         expect(s.get('count')).to.equal(20)
//       })
//
//       it('should handle isLoading', () => {
//         expect(s.get('isLoading')).to.be.false
//       })
//     })
//   })
// })
