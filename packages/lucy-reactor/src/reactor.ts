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
}

export interface RegisterType {
  ( name : string ) : RegisterReturnType
}

export interface ReactorType {
  register : RegisterType
  state : StateType 
  runHooks : () => void
}

export interface HookType {
  () : void
  scope : string
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

function resolvePath
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

function makeState 
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
  const last = op.path.length - 1
  return op.path.reduce
  ( ( current, key, idx ) => {
      const value = current [ key ]
      if ( idx === last ) {
        return value
      } else {
        return value === undefined ? {} : value
      }
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
, scope : string
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
    ( Object.assign
      ( () => {
          const v = get ( cond )
          const state : StateValueType =
            typeof stateArg === 'function'
            ? stateArg ( get ( cond ) )
            : stateArg
          set ( state, value ) 
        }
      , { scope }
      )
    )
    return ops
  }
}

function makeWhen
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

function clearHooks
( store : StorageType
, scope : string
) : void {
  // Naive implementation: we simply parse through all defined
  // hooks and find the ones we own.
  Object.keys ( store.hooks ).forEach
  ( rawpath => {
      const list = store.hooks [ rawpath ]
      const newlist = list.filter
      ( l => l.scope !== scope )
      if ( list.length === 0 ) {
        delete store.hooks [ rawpath ]
      } else {
        store.hooks [ rawpath ] = newlist
      }
    }
  )
}

function makeRegister
( store : StorageType
) : RegisterType {
  return function
  ( name: string
  ) : RegisterReturnType {
    clearHooks ( store, name )
    const when = makeWhen ( store, name )
    return { when }
  }
}

function makeRunHooks
( store: StorageType
) : () => void {
  function runHooks () {
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
  return runHooks
}

export function reactor
(
) : ReactorType {
  const store = { root: {}, changed : [], hooks : {} }
  const state = makeState ( store )
  const register = makeRegister ( store )
  const runHooks = makeRunHooks ( store )
  return { register, state, runHooks }
}