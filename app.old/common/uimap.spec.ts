/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { initBox } from './box.type'
import { initGraph } from './graph.type'
import { mockGraph } from '../store/mock/graph'
import { uimap } from './uimap'

describe
( 'uimap cache', () => {
    // When and what can be reused ?
    // Can reuse what does not depend on children:
    //   * minSize (depends on #children)
    //   * className (depends on ghost ?)
    it ( 'should reuse uibox if same box type'
    , () => {
      }
    )

    it ( 'should reuse text size cache with same text'
    , () => {
      }
    )
  }
)
