# PERFORMANCE

* Optimize graph draw to not replace svg elements but update them ? (sync ?)
  During drag hover, it might take less CPU.

* Make sure uigraph cache is used every time possible (eventually reduce cache usage to text size).


# INTERFACE


# REFACTORING

* 1. Transform store into
  a. user (library, prefs, etc)
  b. project (files, scenes->graph, selected scene)
  c. ui (drag/drop operations, computed graphs, etc)
     having the ui in the store will help us create tutorials by mocking
     ui events.
   ==> Use reducer composition
      ==> Different reducer functions add on different parts
          of the state tree.
          ==> user
          ==> project
              ==> scene
                  ==> node
          ==> ui ?
          return Object.freeze
          ( { user: user ( state.user, action )
            , project: projectReducer ( state.project, action )
            // But ui depends on project...?
            , ui: uiReducer ( state.ui, action )
            }
          )
          // Redux.combineReducers
          const combineReducers = ( reducers ) => {
            return ( state = {}, action ) => {
              return Object.keys ( reducers ).reduce
              ( ( acc, key ) => {
                  acc [ key ] = reducers [ key ] ( state [ key ], action )
                  return acc
                }
              , {}
              )
            }
          }
      ==> Acting on lists: state.map...
      ==> How do we set a 'ref' (react) to keep dom in sync with node.id
      ==> uimap should be called by the master component rendering a graph.
          This should only happen when the prop for this component (a graph) is changed. No need to tinker with uimap outside of rendering components !! As simple as that !!
      ==> We could keep a 'uiState' sub-tree for all the communication
          with the player, database, etc. But we should not use it to compute features only required to display a component.
* 2. Transform code from boxdrag to use the store instead of a service...
  --
  StartDrag => Post event to store
  DragMove => Post event to store
  --
  Drop => etc
* Use seamless-immutable (once they have proper typings) ?
