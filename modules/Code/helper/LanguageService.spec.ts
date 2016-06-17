import { describe } from '../../Test'
import * as LanguageService from './LanguageService'

describe ( 'LanguageService.compile', ( it ) => {

  it ( 'should return errors on invalid code', ( assert ) => {
    const { code, errors } = LanguageService.compile ( 'x' )

    assert.same ( code, undefined )

    assert.equal
    ( { message: "Cannot find name 'x'.", loc: { line: 0, ch: 0 } }
    , errors [ 0 ]
    )
  })

  it ( 'should recognize lucidity', ( assert ) => {
    const { code, errors } = LanguageService.compile ( "import { Meta } from 'lucidity'" )

    assert.same ( errors, undefined )
    assert.equal ( code, '"use strict";\n' )
  })

  it ( 'should recognize browser libs', ( assert ) => {
    const { code, errors } = LanguageService.compile ( "window.boom()" )

    assert.equal
    ( "Property 'boom' does not exist on type 'Window'."
    , errors [ 0 ].message
    )
  })
})
