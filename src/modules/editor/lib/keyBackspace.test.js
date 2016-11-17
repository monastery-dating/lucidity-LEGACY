/* global it expect describe */
import mockComposition from '../mockComposition'
import keyBackspace from './keyBackspace'

const composition = mockComposition()

describe('keyBackspace', () => {
  it('removes last character', () => {
    const selection = {
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 2,
      focusPath: ['zhaog', 'oaiue'],
      focusOffset: 2
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'oaiue'],
        value: {p: 1, t: 'S', i: 'mssage'}
      },
      {
        op: 'select', path: ['zhaog', 'oaiue'],
        offset: 1
      }
    ])
  })
})
