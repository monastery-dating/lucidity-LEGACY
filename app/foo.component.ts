import { ChangeDetectionStrategy, Component, Inject, Input } from 'angular2/core'
import { storeToken } from './store/index'

@Component
( { selector: 'foo'
  , changeDetection: ChangeDetectionStrategy.OnPush
  , template:
    ` <div style='border:1px solid black; margin:20px; padding: 20px; float:left; color: white; width:200px;'>
        <h1>THIS IS {{ compname }}</h1>
        <button (click)='changeName()'>change</button>
        <button (click)='addColor()'>add</button>
        <h3> {{ name.name }} </h3>
        <ul>
          <li *ngFor='#color of ( colors )'>
            {{ color }}
          </li>
        </ul>
      </div>
    `
  }
)
export class FooComponent {
  @Input() colorState: any
  @Input() nameState: any

  nameCursor: any
  colorsCursor: any
  compname: string = 'Foo onPush'

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
    this.nameCursor.set ( { name: `${this.compname} Name` } )
  }

  get name () {
    console.log ( `==${this.compname} NAME==`)
    // return this.nameCursor.get ()
    return this.nameState
  }

  get colors () {
    console.log ( `==${this.compname} COLORS==`, this.colorState )
    // return this.colorsCursor.get ()
    return this.colorState // this.colorsCursor.get ()
  }
}
