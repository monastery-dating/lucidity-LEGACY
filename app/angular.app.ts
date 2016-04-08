import {Component} from 'angular2/core'
import ClockComponent from './clock.component'
import TodosComponent from './todos.component'
import store from './state/store'

@Component
( { selector: 'app'
  , directives:
    [ ClockComponent
    , TodosComponent
    ]
  , providers: store
  , template: `
    <p>Hello {{ name }}</p>
    <button (click)="onClickMe()">Click me!</button>
    <p>
      CLOCK: <clock time='yesterday'></clock>
    </p>
    <todos></todos>
    `
  }
)
export class AppComponent {
  name = 'Lucidity'

  onClickMe () {
    this.name = 'Lucidity with Angular 2 !'
  }
}
