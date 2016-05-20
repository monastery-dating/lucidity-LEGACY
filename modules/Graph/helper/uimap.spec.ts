import { describe } from '../../Test/runner'
import { uimap } from './uimap'

describe ( 'uimap cache', ( it ) => {
    // When and what can be reused ?
    // Can reuse what does not depend on children:
    //   * minSize (depends on #children)
    //   * className (depends on ghost ?)
    it ( 'should reuse uibox if same box type', ( assert ) => {
      }
    )

    it ( 'should reuse text size cache with same text', ( assert ) => {
      }
    )

  }
)
