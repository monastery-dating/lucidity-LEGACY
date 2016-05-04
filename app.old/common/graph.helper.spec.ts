/// <reference path="../../typings/jasmine/jasmine.d.ts" />
import { GraphType, initGraph } from './graph.type'
import { nextGraphId, removeInGraph, rootGraphId } from './graph.helper'
import { merge } from '../util/merge.util'
import { mockGraph } from '../store/mock/graph'

describe
( 'Graph helper', () => {
    describe
    ( 'existing graph', () => {
        beforeEach ( function () {
            this.graph = mockGraph
          }
        )

        it ( 'compute next graph id'
        , function () {
            const keys = this.graph.boxes
            let n = 0
            while ( keys [ `id${n}` ] ) {
              n += 1
            }
            expect ( nextGraphId ( this.graph ) )
            .toBe ( `id${n}` )
          }
        )

        it ( 'remove element in graph'
        , function () {
            const boxid = 'id3'
            const newgraph = removeInGraph ( this.graph, boxid )
            expect ( newgraph.boxes [ boxid ] )
            .toBe ( undefined )
            expect ( getKeys ( newgraph.boxes ) )
            .toBe ( 'id0, id4, id5' )
            expect ( newgraph.boxes['id4'].link )
            .toEqual ( [] )
          }
        )
      }
    )

    describe ( 'empty graph', () => {
        beforeEach ( function () {
            this.graph = { boxes: [] }
          }
        )

        it ( 'compute next graph id to root graph id'
        , function () {
            expect ( nextGraphId ( this.graph ) )
            .toBe ( rootGraphId )
          }
        )
      }
    )
  }
)

const getKeys = function
( obj: Object ) : string {
  const r = []
  for ( const k in obj ) {
    r.push ( k )
  }
  return r.sort ().join ( ', ' )
}
