import { ChangeDetectionStrategy, Component, Input } from 'angular2/core'
import { UIBoxType } from './uibox.type'

@Component
( { selector: 'g[le-box]'
  , changeDetection: ChangeDetectionStrategy.OnPush
  , directives:
    [
    ]
  , template:
    ` <svg:g [attr.transform]='transform'>
        <svg:path [attr.d]='path' [attr.class]='className'></svg:path>
        <svg:text [attr.x]='tx' [attr.y]='ty' class='tbox' [attr.class]='className'>{{ name }}</svg:text>
        <svg:path *ngFor='#slot of slots'
          [attr.d]='slot.path'
          [attr.class]='slot.className'></svg:path>
      </svg:g>
    `
  }
)
export class BoxComponent {
  @Input() uibox: UIBoxType
  get transform () {
    const x = this.uibox.pos.x
    const y = this.uibox.pos.y
    return `translate(${x},${y})`
  }
  get tx () {
    return this.uibox.size.tx
  }
  get ty () {
    return this.uibox.size.ty
  }
  get className () {
    if ( this.uibox.isGhost ) {
      return this.uibox.className + ' ghost'
    }
    return this.uibox.className
    //return this.box.name === 'filter.Bloom'
    //  ? this.box.className : `${this.box.className} dark`
  }
  get name () {
    return this.uibox.name
  }
  get path () {
    return this.uibox.path
  }
  get slots () {
    return this.uibox.slots
  }
}
