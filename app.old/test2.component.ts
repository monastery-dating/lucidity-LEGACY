import { Component, Input } from 'angular2/core'

@Component
( { selector: 'le-test2'
  , directives:
    [
    ]
  , template:
    `
      <div>my name is: {{name}}</div>
    `
  }
)
export class Test2Component {
  @Input() name: string
}
