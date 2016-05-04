/*
import
{ RECEIVE_LIBRARY
, REFRESHING_LIBRARY
, REFRESHING_LIBRARY_ERROR
} from '../mutation-types'

// initial state
const state =
{ all: []
, refreshing: false
, error: ''
}

// mutations
const mutations =
{ [ REFRESHING_LIBRARY ] ( s, isRefresh ) {
    s.refreshing = isRefresh
  }
, [ RECEIVE_LIBRARY ] ( s, list ) {
    s.refreshing = false
    s.error = ''
    s.all = list
  }
, [ REFRESHING_LIBRARY_ERROR ] ( s, err ) {
    s.refreshing = false
    s.error = err
  }
}

export default
{ state
, mutations
}
*/
