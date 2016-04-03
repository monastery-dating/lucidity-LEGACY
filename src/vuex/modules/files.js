import
{ DEFAULT_LAYOUT
, boxLayout
} from '../../lib/boxDraw.js'

import
{ FILES_ADD
} from '../mutation-types'

import Graph from '../../state/graph.yml'

// initial state
const bdefs = {}
boxLayout ( Graph.files, 'f0', DEFAULT_LAYOUT, bdefs, null )

const state =
{ graph: Graph.files
, all: bdefs.all
, boxdef: bdefs.boxdef
}

const sortFiles = ( a, b ) => a.name > b.name ? 1 : 0

const uniqueName = function ( all, aname, i = 0 ) {
  const name = aname + ( i === 0 ? '' : `-${i}` )
  for ( const e of all ) {
    if ( name === e.name ) {
      return uniqueName ( all, aname, i + 1 )
    }
  }
  return name
}


// mutations
const mutations =
{ [ FILES_ADD ] ( { all }, { name } ) {
    all.push ( { name: uniqueName ( all, name ) } )
    all.sort ( sortFiles )
  }
}

// state.all.sort ( sortFiles )

export default
{ state
, mutations
}

