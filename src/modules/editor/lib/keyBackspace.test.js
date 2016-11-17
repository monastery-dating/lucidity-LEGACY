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

  it('merges with previous paragraph at start of line', () => {
    const selection = {
      anchorPath: ['zhaog', 'oiafg'],
      anchorOffset: 0,
      focusPath: ['zhaog', 'oiafg'],
      focusOffset: 0
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['mcneu', 'ncgow'],
        // TODO: should join paragraphs with space ?
        value: {p: 4, t: 'T', i: '.This is the first '}
      },
      {
        op: 'select', path: ['mcneu', 'ncgow'],
        offset: 1
      },
      {
        op: 'update', path: ['mcneu', 'oaiue'],
        value: {p: 5, t: 'S', i: 'message'}
      },
      {
        op: 'update', path: ['mcneu', 'haiou'],
        value: {p: 6, t: 'T', i: '. Hello blah bomgolo frabilou elma tec.'}
      },
      {op: 'delete', path: ['zhaog']}
    ])
  })

  it('merges with previous complex paragraph at start of line', () => {
    const selection = {
      anchorPath: ['zaahg'],
      anchorOffset: 0,
      focusPath: ['zaahg'],
      focusOffset: 0
    }
    expect(
      keyBackspace(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zhaog', 'haiou'],
        // TODO: should join paragraphs with space ?
        value: {p: 2, t: 'T', i: '. Hello blah bomgolo frabilou elma tec.This is the third paragraph. My tailor types fast.'}
      },
      {
        op: 'select', path: ['zhaog', 'haiou'],
        offset: 39
      },
      {op: 'delete', path: ['zaahg']}
    ])
  })
})
