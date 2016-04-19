import { BoxType } from '../common/box.type'
import { BoxDragComponent } from './boxdrag.component'

export class BoxDragService {
  private comp: BoxDragComponent

  setComp ( comp: BoxDragComponent ) {
    this.comp = comp
  }

  register ( el: any, boxid: string, from: string ) {
    this.comp.register ( el, boxid, from )
  }
}
