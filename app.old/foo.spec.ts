/// <reference path="../typings/jasmine/jasmine.d.ts" />
import { FooComponent } from './foo.component'

describe
( 'FooComponent', () => {

    beforeEach
    ( function () {
        this.foo = new FooComponent ()
      }
    )

    it
    ( 'should have name property'
    , function () {
        expect ( this.foo.name )
        .toBe ( 'Foo' )
      }
    )
  }
)
