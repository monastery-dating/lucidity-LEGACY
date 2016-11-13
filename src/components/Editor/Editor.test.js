/* global it expect describe */
import React from 'react'
import {snapshot} from '../TestHelper'
import Editor from './'

const editorState = {
  composition: {
    paragraphs: {
      one: {
        ref: 'one',
        position: 0.0,
        type: 'P',
        text: 'This is the first message. Hello blah bomgolo frabilou elma tec.',
        markup: {
          iahyx: {
            start: 18,
            end: 25,
            type: 'STRONG'
          }
        }
      },
      two: {
        ref: 'two',
        position: 2.0,
        type: 'P',
        text: 'This is the second <b>message</b>. Hello blah bomgolo frabilou elma tec.'
      },
      three: {
        ref: 'three',
        position: 3.0,
        type: 'P',
        text: 'This is the third **message**. Hello blah bomgolo frabilou elma tec.'
      }
    }
  }
}

describe('editor', () => {
  it('renders paragraphs in order', () => {
    const tree = snapshot(<Editor />, {editor: editorState})
    expect(tree).toMatchSnapshot()
  })
})
