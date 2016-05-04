// Use seamless-immutable when we have proper typings for it.
// import Immutable from 'seamless-immutable'
// https://github.com/rtfeldman/seamless-immutable/issues/108
export const merge = function<T, S>
( t: T, s: S ) : T & S {
  const res: any = {}
  // copy
  for ( const k in t ) {
    if ( t.hasOwnProperty ( k ) ) {
      res [ k ] = t [ k ]
    }
  }
  // merge
  for ( const k in s ) {
    if ( s.hasOwnProperty ( k ) ) {
      if ( s [ k ] === null ) {
        delete res [ k ]
      }
      else {
        res [ k ] = s [ k ]
      }
    }
  }
  return res
}
