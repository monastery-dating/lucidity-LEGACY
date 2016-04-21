import { BoxType } from '../common/box.type'
import { BoxDragComponent } from './boxdrag.component'

export class BoxDragService {
  private comp: BoxDragComponent

  setComp ( comp: BoxDragComponent ) {
    this.comp = comp
  }

  registerDragable ( el: any, boxid: string, from: string ) {
    this.comp.registerDragable ( el, boxid, from )
  }

  registerDropzone ( el: any, to: string ) {
    this.comp.registerDropzone ( el, to )
  }
}
