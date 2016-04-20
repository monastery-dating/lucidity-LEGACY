import { Component, Inject, OnInit } from 'angular2/core'

// This component is used for experimenting stuff.

@Component
( { selector: 'le-foo'
  , directives:
    [
    ]
  , template:
    `
      <div>{{ name }}</div>
    `
  }
)
export class FooComponent {
  private name: string = 'Foo'
}
