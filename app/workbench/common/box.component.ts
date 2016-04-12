import { Component, Input } from 'angular2/core'
import { UIBoxType } from './uibox.type'

@Component
( { selector: 'g[le-box]'
  , directives:
    [ BoxComponent
    ]
  , template:
    ` <svg:g [attr.transform]='transform'>
        <svg:path [attr.d]='path' [attr.class]='className'></svg:path>
        <svg:text [attr.x]='tx' [attr.y]='ty' class='tbox' [attr.class]='className'>{{ name }}</svg:text>
        <svg:path *ngFor='#slot of slots'
          class='slot'
          [attr.d]='slot'
          [attr.class]='sclass'></svg:path>
      </svg:g>
    `
  }
)
export class BoxComponent {
  @Input() box: UIBoxType
  get transform () {
    const x = this.box.pos.x
    const y = this.box.pos.y
    return `translate(${x},${y})`
  }
  get tx () {
    return this.box.size.tx
  }
  get ty () {
    return this.box.size.ty
  }
  get className () {
    return this.box.className
    //return this.box.name === 'filter.Bloom'
    //  ? this.box.className : `${this.box.className} dark`
  }
  get name () {
    return this.box.name
  }
  get path () {
    return this.box.path
  }
  get slots () {
    return this.box.slots
  }
  get sclass () {
    return this.box.name === 'filter.Bloom' ? 'pulse' : ''
  }
}
