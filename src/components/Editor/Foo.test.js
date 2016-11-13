/* global it expect describe */
import React from 'react'
import {snapshot} from '../TestHelper'
import Foo from './Foo'

describe('Foo', () => {
  it('renders foo name', () => {
    const tree = snapshot(<Foo />, {foo: {bar: 'baz'}})
    expect(tree).toMatchSnapshot()
  })
})
