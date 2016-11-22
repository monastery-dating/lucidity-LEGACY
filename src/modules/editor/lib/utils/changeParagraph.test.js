/* global it expect describe */
import {mockComposition} from './testUtils.js'
import caretSelection from './caretSelection'
import changeParagraph from './changeParagraph'

describe('changeParagraph', () => {
  it('creates heading with proper level', () => {
    const composition = mockComposition()
    const selection = caretSelection(['zaahg'], 0)
    expect(
      changeParagraph(composition, selection, {h: 3})
    )
    .toEqual([
      {
        op: 'update',
        path: ['zaahg'],
        value: {
          t: 'P', p: 2,
          // opts
          o: {h: 3},
          i: 'This is the third paragraph. My tailor types fast.'
        }
      },
      { op: 'select', value: selection }
    ])
  })

  it('resets to simple paragraph', () => {
    const composition = mockComposition()
    composition.i.zaahg.o = {h: 3}
    const selection = caretSelection(['zaahg'], 0)
    expect(
      changeParagraph(composition, selection, null)
    )
    .toEqual([
      {
        op: 'update',
        path: ['zaahg'],
        value: {
          t: 'P', p: 2,
          i: 'This is the third paragraph. My tailor types fast.'
        }
      },
      { op: 'select', value: selection }
    ])
  })

  it('creates heading with complex paragraph', () => {
    const composition = mockComposition()
    const selection = caretSelection(['zhaog', 'oiafg'], 0)
    expect(
      changeParagraph(composition, selection, {h: 3})
    )
    .toEqual([
      {
        op: 'update',
        path: ['zhaog'],
        value: {
          t: 'P', p: 1,
          // opts
          o: {h: 3},
          i: composition.i.zhaog.i
        }
      },
      { op: 'select', value: selection }
    ])
  })
})
