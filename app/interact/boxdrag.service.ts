import { BehaviorSubject, Subscription } from 'rxjs'
import { SlotType } from '../common/slot.type'
import { BoxType, initBox } from '../common/box.type'

export class BoxDragService {
  private observable: BehaviorSubject<BoxType>

  constructor () {
    this.observable = new BehaviorSubject ( initBox () )
  }

  subscribe ( clbk: ( box: BoxType ) => void )  {
    return this.observable.subscribe ( clbk )
  }

  setBox ( name: string, input: SlotType[], out: SlotType, type: string ) {
    this.observable.next
    ( { name
      , in: input
      , out
      , type
      }
    )
  }
}
