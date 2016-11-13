/* global it expect describe */
import React from 'react'
import {snapshot, render} from '../TestHelper'
import Editor from './'

const editorState = {
  composition: {
    i: {
      // Block = PARAGRAPH / MEDIA LEVEL
      zhaog: {
        p: 0.0, // position
        t: 'P', // type <p>
        i: {
          // Markup = bold, italic, etc
          oiafg: {
            p: 0.0,
            t: 'T', // <span>
            i: 'This is the first '
          },
          oaiue: {
            p: 1.0,
            t: 'S', // <span class='s'>
            i: 'message'
          },
          haiou: {
            p: 2.0,
            t: 'T', // <span>
            i: '. Hello blah bomgolo frabilou elma tec.'
          }
        }
      },
      mcneu: {
        p: 0.0, // position
        t: 'P', // type <p>
        i: {
          uasuf: {
            p: 0.0,
            t: 'T', // <span>
            i: 'You can click '
          },
          // Link
          jnaid: {
            p: 1.0,
            t: 'A', // <a>
            href: 'http://example.com',
            i: {
              mnzjq: {
                p: 0.0,
                t: 'T',
                i: 'this '
              },
              zzvgp: {
                p: 1.0,
                t: 'S+E', // <span class='s e'>
                i: 'link'
              }
            }
          },
          mznao: {
            p: 2.0,
            t: 'T', // <span>
            i: 'to view the next '
          },
          mnah: {
            p: 3.0,
            t: 'E',
            i: 'page'
          },
          ncgw: {
            p: 4.0,
            t: 'T',
            i: '.'
          }
        }
      },
      zaahg: {
        p: 3.0,
        t: 'P',
        i: 'This is the third paragraph. Hello blah bomgolo frabilou elma tec.'
      }
    }
  }
}

describe('editor', () => {
  it('renders without crashing', () => {
    render(<Editor />, {editor: editorState})
  })

  it('renders paragraphs in order', () => {
    const tree = render(<Editor />, {editor: editorState})
    expect(tree.find('Element').map(e => e.prop('elementRef'))).toEqual(['one', 'three', 'two'])
  })

  it('sets ref', () => {
    const tree = render(<Editor />, {editor: editorState})
    expect(snapshot(tree)).toMatchSnapshot()
  })
})
