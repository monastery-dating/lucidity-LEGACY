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
  return Object.freeze ( res )
}

export const append = function<T>
( t: T[], s: T ) : T {
  return insert ( t, -1, s )
}

export const insert = function<T>
( t: T[], pos: number, s: T ) : T {
  const res: any = []
  const len = t.length
  let p = pos < 0 ? len + pos + 1 : pos
  if ( p > len ) {
    p = len
  }
  else if ( p < 0 ) {
    p = 0
  }
  let di = 0
  for ( let i = 0; i < len + 1; i += 1 ) {
    if ( i === p ) {
      res [ i ] = s
      di = 1
    }

    if ( i < len ) {
      res [ i + di ] = t [ i ]
    }
  }
  return Object.freeze ( res )
}

export const aset = function<T>
( t: T[], pos: number, s: T ) : T {
  const res: any = []
  const len = t.length
  let p = pos
  if ( p >= len || p < 0 ) {
    throw `Cannot set indice ${p} in array of length ${len}.`
  }
  for ( let i = 0; i < len; i += 1 ) {
    if ( i === p ) {
      res [ i ] = s
    }
    else {
      res [ i ] = t [ i ]
    }
  }
  return Object.freeze ( res )
}
