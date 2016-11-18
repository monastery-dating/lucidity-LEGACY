/* global it expect describe */
import mockComposition from '../../mockComposition'
import fixSelectOrder from './fixSelectOrder'

const composition = mockComposition()

describe('fixSelectOrder', () => {
  it('add fixed to normal order', () => {
    const selection = {
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 3,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 10,
      type: 'Range'
    }
    expect(
      fixSelectOrder(composition, selection)
    )
    .toEqual({
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 3,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 10,
      type: 'Range',
      fixed: true
    })
  })

  it('changes reverse order', () => {
    const selection = {
      anchorPath: ['zhaog', 'haiou'],
      anchorOffset: 10,
      focusPath: ['zhaog', 'oaiue'],
      focusOffset: 3,
      type: 'Range'
    }
    expect(
      fixSelectOrder(composition, selection)
    )
    .toEqual({
      anchorPath: ['zhaog', 'oaiue'],
      anchorOffset: 3,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 10,
      type: 'Range',
      fixed: true
    })
  })

  it('returns fixed selection', () => {
    const selection = {
      fixed: true
    }
    expect(
      fixSelectOrder(null, selection)
    )
    .toBe(selection)
  })

  it('returns empty selection', () => {
    const selection = {
      type: 'Caret'
    }
    expect(
      fixSelectOrder(null, selection)
    )
    .toBe(selection)
  })
})
