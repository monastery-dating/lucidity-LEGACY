export interface StateType {
  ( strings : TemplateStringsArray
  , ... values : any []
  ) : StateValueType
}

export interface WhenType {
  ( ... clauses : any [] ) : any
}

export interface RegisterReturnType {
  when : WhenType
  runHooks : () => void
}

export interface RegisterType {
  ( name : string ) : RegisterReturnType
}

export interface ReactorType {
  register : RegisterType
  state : StateType 
}

export interface HookType {
  () : void
}

export interface HookMapType {
  [ key : string ] : HookType []
}

export interface StorageType {
  root : any
  // what changed since last hook trigger
  changed : string []
  // TODO find a way to remove registered hooks
  hooks : HookMapType
}

export interface StateValueType {
  path : string []
  rawpath : string
  store : StorageType
}

export interface StateValueFunc {
  ( value : any ) : StateValueType
}

export function resolvePath
( strings : TemplateStringsArray
, ... values : any []
) : string {
  return strings.reduce
  ( ( current, string, idx ) => {
      const value = values [ idx ]
      return current
            + string
            + ( value === undefined ? '' : value )
    }
  , ''
  )
}

export function makeState 
( store : StorageType
) : StateType {
  return function
  ( strings : TemplateStringsArray
  , ... values : any []
  ) : StateValueType {
    const rawpath = resolvePath ( strings, values )
    const path = rawpath.split ( '.' )
    return { path, rawpath, store }
  }
}

export interface OperationsType {
  set : SetOperationType
}

export interface SetOperationType {
  ( state : StateValueType
  , value : any
  ) : OperationsType
}

export function get
( op : StateValueType
) : any {
  return op.path.reduce
  ( ( current, key ) => {
      const value = current [ key ]
      return value === undefined ? {} : value
    }
  , op.store.root
  ) 
}

type SetValueType = number | string | StateValueType

function isStateValue
( value : SetValueType
) : value is StateValueType {
  return typeof value === 'object'
}


export function set
( op : StateValueType
, valueArg : SetValueType
) : void {
  const lastIdx = op.path.length - 1

  const value : any = isStateValue ( valueArg )
    ? get ( valueArg )
    : valueArg

  op.path.reduce
  ( ( current, key, idx ) => {
      if ( idx === lastIdx ) {
        current [ key ] = value
        return value
      } else {
        let v = current [ key ]
        if ( v === undefined ) {
          v = current [ key ] = {}
        }
        return v
      }
    }
  , op.store.root
  ) 

  op.store.changed.push ( op.rawpath )
}

function makeSetOp
( store : StorageType
, name : string
, cond : StateValueType
, ops : OperationsType
) : SetOperationType {
  let hooks = store.hooks [ cond.rawpath ]
  if ( ! hooks ) {
    hooks = store.hooks [ cond.rawpath ] = []
  }
  return function
  ( stateArg : StateValueType | StateValueFunc
  , value : SetValueType
  ) : OperationsType {
    hooks.push
    ( () => {
        const v = get ( cond )
        const state : StateValueType =
          typeof stateArg === 'function'
          ? stateArg ( get ( cond ) )
          : stateArg
        set ( state, value ) 
      }
    )
    return ops
  }
}

export function makeWhen
( store : StorageType
, name : string
) : WhenType {
  return function when
  ( cond : StateValueType
  ) : OperationsType {
    const ops = <OperationsType>( {} )
    ops.set = makeSetOp ( store, name, cond, ops )
    return ops
  }
}

export function makeRegister
( store : StorageType
) : RegisterType {
  return function
  ( name: string
  ) : RegisterReturnType {
    const when = makeWhen ( store, name )
    const runHooks = function runHooks () {
      if ( store.changed.length === 0 ) {
        return
      }
      const { changed, hooks } = store
      // In case the operations trigger new hooks
      store.changed = []
      const seen = {}
      changed.forEach
      ( path => {
          if ( ! seen [ path ] ) {
            seen [ path ] = true
            const funList = hooks [ path ]
            if ( funList ) {
              funList.forEach ( f => f () )
            }
          }
        }
      )
      runHooks ()
    }
    return { when, runHooks }
  }
}

export function reactor
(
) : ReactorType {
  const store = { root: {}, changed : [], hooks : {} }
  const state = makeState ( store )
  const register = makeRegister ( store )
  return { register, state }
}