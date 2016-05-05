import { ChangeDetectionStrategy, Component, Inject } from 'angular2/core'
import { storeToken } from './store/index'

@Component
( { selector: 'bar'
  , changeDetection: ChangeDetectionStrategy.OnPush
  , template:
    ` <div style='border:1px solid black; margin:20px; padding: 20px;'>
        <h1>THIS IS {{ compname }}</h1>
        <button (click)='changeName()'>change</button>
        <button (click)='addColor()'>add</button>
        <h3> {{ name }} </h3>
        <ul>
          <li *ngFor='#color of ( colors )'>
            {{ color }}
          </li>
        </ul>
      </div>
    `
  }
)
export class BarComponent {
  nameCursor: any
  colorsCursor: any
  compname: string = 'Bar'

  constructor ( @Inject (storeToken) private store ) {
    // https://github.com/Yomguithereal/baobab
    this.nameCursor = store.select ( 'name' )
    this.colorsCursor = store.select ( 'colors' )

    this.colorsCursor.on
    ( 'update'
    , () => {
        // What do I put here to update the component ?
      }
    )
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
