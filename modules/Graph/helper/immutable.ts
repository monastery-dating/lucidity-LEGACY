// Object.assign polyfill
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

export module Immutable {
export const merge = function<T, S>
( t: T, s: S ) : T & S {
  return Object.freeze ( Object.assign ( {}, t, s ) )
}

export const remove = function<T>
( t: T, k: string ) : T {
  // copy
  const res = Object.assign ( {}, t )
  delete res [ k ]
  return Object.freeze ( res )
}

export const append = function<T>
( t: T[]
, s: T
, f?: (a:T, b:T ) => number
) : T[] {
  const res = [ ...t, s ]
  if ( f ) { res.sort ( f ) }
  return Object.freeze ( res )
}

export const insert = function<T>
( t: T[]
, pos: number
, s: T
) : T[] {
  const res: any = []
  const len = t.length
  let p = pos < 0 ? len + pos + 1 : pos

  if ( p > len ) {
    const r = [...t]
    let i = len
    while ( i < p ) {
      r.push ( null )
      i += 1
    }
    r.push ( s )
    return Object.freeze ( r )
  }
  else if ( p < 0 ) {
    p = 0
  }
  let di = 0
  for ( let i = 0; i < len + 1; i += 1 ) {
    if ( i === p ) {
      res [ i ] = s
      if ( t [ i ] === null ) {
        continue
      }
      else {
        di = 1
      }
    }

    if ( i < len ) {
      res [ i + di ] = t [ i ]
    }
  }
  return Object.freeze ( res )
}

export const aset = function<T>
( t: T[], p: number, s: T ) : T[] {
  const res: any = []
  const len = Math.max ( t.length, p + 1 )
  if ( p < 0 ) {
    throw `Cannot set indice ${p} in array of length ${len}.`
  }
  for ( let i = 0; i < len; i += 1 ) {
    if ( i === p ) {
      res [ i ] = s
    }
    else {
      // fill with null values if t [ i ] does not exist
      res [ i ] = t [ i ] || null
    }
  }
  return Object.freeze ( res )
}

const doUpdate = function<T>
( t: T, keys: string[], pos: number, s: any ) : T {
  const k = keys [ pos ]
  if ( pos === keys.length - 1 ) {
    // last
    if ( typeof s === 'function' ) {
      const v = s ( t [ k ] )
      return merge ( t, { [ k ]: v } )
    }
    else {
      return merge ( t, { [ k ]: s } )
    }
  }
  let tv = t [ k ]
  if ( tv === undefined ) {
    tv = {}
  }
  return merge ( t, { [ k ]: doUpdate ( tv, keys, pos + 1, s ) } )
}

export const update = function<T>
( t: T, ...args: any[]) : T {
  const value = args.pop ()
  const keys = <string[]>args
  return doUpdate ( t, keys, 0, value )
}

export const sort = function<T>
( t: T[], f: ( a:T, b:T ) => number ) : T[] {
  const res = [...t]
  res.sort ( f )
  return Object.freeze ( res )
}
}
