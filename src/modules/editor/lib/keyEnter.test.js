/* global it expect describe jest */
import mockComposition from '../mockComposition'
import keyEnter from './keyEnter'

const composition = mockComposition()

let counter = 0
jest.mock('./makeRef', () => {
  return jest.fn(() => `refe${++counter}`)
})

describe('keyEnter', () => {
  it('splits to make new paragraph', () => {
    counter = 0
    const selection = {
      anchorPath: ['mcneu', 'jnaid', 'zzvgp'],
      anchorOffset: 2,
      focusPath: ['mcneu', 'jnaid', 'zzvgp'],
      focusOffset: 2
    }
    expect(
      keyEnter(composition, selection)
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

  it('creates new paragraph at end', () => {
    counter = 0
    const selection = {
      anchorPath: ['zhaog', 'haiou'],
      anchorOffset: 39,
      focusPath: ['zhaog', 'haiou'],
      focusOffset: 39
    }
    expect(
      keyEnter(composition, selection)
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
})
