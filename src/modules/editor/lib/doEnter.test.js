/* global it expect describe jest */
import mockComposition from '../mockComposition'
import doEnter from './doEnter'

const composition = mockComposition()

let counter = 0
jest.mock('./utils/makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

describe('doEnter', () => {
  it('splits to make new paragraph', () => {
    counter = 0
    const selection = {
      anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
      anchorOffset: 2,
      focusPath: ['mcneu', 'jnaid', 'zzvgp'],
      focusOffset: 2
    }
    expect(
      doEnter(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['mcneu', 'jnaid', 'zzvgp'],
        value: {p: 1, t: 'S+E', i: 'li'}
      },
      {op: 'delete', path: ['mcneu', 'mznao']},
      {op: 'delete', path: ['mcneu', 'mnahl']},
      {op: 'delete', path: ['mcneu', 'ncgow']},
      {
        op: 'update', path: ['refe1'],
        value: {p: 0.5, t: 'P', i: {
          refe2: {p: 0, t: 'T', i: 'nk to view the next '},
          mnahl: {p: 1, t: 'E', i: 'page'},
          ncgow: {p: 2, t: 'T', i: '.'}
        }}
      },
      {
        op: 'select', path: ['refe1'],
        offset: 0
      }
    ])
  })

  it('creates new paragraph when selection at end', () => {
    counter = 0
    const selection = {
      anchorPath: ['zhaog', 'haiou'],
      anchorOffset: 39,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 39
    }
    expect(
      doEnter(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['refe1'],
        value: {p: 1.5, t: 'P', i: ''}
      },
      {
        op: 'select', path: ['refe1'],
        offset: 0
      }
    ])
  })

  it('splits flat paragraph', () => {
    counter = 0
    const selection = {
      anchorPath: ['zaahg'],
      anchorOffset: 11,
      focusPath: ['zaahg'],
      focusOffset: 11
    }
    expect(
      doEnter(composition, selection)
    )
    .toEqual([
      {
        op: 'update', path: ['zaahg'],
        value: {p: 2, t: 'P', i: 'This is the'}
      },
      {
        op: 'update', path: ['refe1'],
        value: {p: 3, t: 'P', i: 'third paragraph. My tailor types fast.'}
      },
      {
        op: 'select', path: ['refe1'],
        offset: 0
      }
    ])
  })
})
