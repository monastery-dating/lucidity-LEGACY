import { Component, Inject } from 'angular2/core'
import { FooComponent } from './foo.component'
import { BarComponent } from './bar.component'
import { store, storeToken } from './store/index'

@Component
( { selector: 'le-app'
  , directives:
    [ FooComponent
    , BarComponent
    ]
  , providers:
    [ store
    ]
  , template:
    ` <div style='border:1px solid black; margin:20px; padding: 20px;'>
        <h1>THIS IS {{ compname }}</h1>
        <button (click)='changeName()'>name</button>
        <button (click)='addColor()'>add</button>
        <h3> {{ name }} </h3>
        <ul>
          <li *ngFor='#color of ( colors )'>
            {{ color }}
          </li>
        </ul>
      </div>
      <foo></foo>
      <bar></bar>
    `
  }
)
export class AppComponent {
  nameCursor: any
  colorsCursor: any
  compname: string = 'App'

  constructor ( @Inject (storeToken) private store ) {
    // https://github.com/Yomguithereal/baobab
    this.nameCursor = store.select ( 'name' )
    this.colorsCursor = store.select ( 'colors' )
  }

  addColor () {
    this.colorsCursor.push ( `${this.compname} green` )
  }

  changeName () {
    this.nameCursor.set ( `${this.compname} Name` )
  }

  get name () {
    console.log ( `==${this.compname} NAME==`)
    return this.nameCursor.get ()
  }

  get colors () {
    console.log ( `==${this.compname} COLORS==`)
    return this.colorsCursor.get ()
  }
}
