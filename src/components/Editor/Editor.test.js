/* global it expect describe */
import React from 'react'
import {snapshot, render} from '../TestHelper'
import Editor from './'
import mockComposition from '../../modules/editor/mockComposition'

const editorState = {
  composition: mockComposition()
}

describe('editor', () => {
  it('renders without crashing', () => {
    render(<Editor />, {editor: editorState})
  })

  it('renders paragraphs in order', () => {
    expect(
      render(<Editor />, {editor: editorState})
      .find('p').map(e => e.prop('data-ref'))
    )
    .toEqual(['mcneu', 'zhaog', 'zaahg'])
  })

  it('sets ref', () => {
    expect(
      snapshot(
        render(<Editor />, {editor: editorState})
      )
    )
    .toMatchSnapshot()
  })
})
