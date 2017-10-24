/* global it expect describe */
import { JSX, connect } from '../Component'
import { snapshot, render } from '../TestHelper'
import Composition from './Composition'
import { mockComposition } from '../../modules/editor/lib/utils/testUtils'

const editorState =
{ composition: mockComposition ()
}

describe ( 'editor', () => {
  it ( 'renders without crashing', () => {
    render ( <Composition />, { editor: editorState } )
  })

  it ( 'renders paragraphs in order', () => {
    expect
    ( render ( <Composition />, { editor: editorState } )
      .find ( 'p' ).map ( e => e.prop ( 'data-ref' ) )
    )
    .toEqual
    ( [ 'mcneu', 'zhaog', 'zaahg' ] )
  })

  it ( 'sets ref', () => {
    expect
    ( snapshot
      ( render ( <Composition />, { editor: editorState } )
      )
    )
    .toMatchSnapshot ()
  })
})
