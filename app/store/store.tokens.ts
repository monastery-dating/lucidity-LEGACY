import { OpaqueToken } from 'angular2/core'

// These are just symbols that are better then strings because they avoid
// name clash.
export const initStateToken = new OpaqueToken ( 'initState' )
export const stateToken = new OpaqueToken ( 'state' )
export const dispatcherToken = new OpaqueToken ( 'dispatcher' )
