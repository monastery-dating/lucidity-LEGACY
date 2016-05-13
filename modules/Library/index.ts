export const Library =
( options = {} ) => {
  return (module, controller) => {
    module.addState
    ( { $rows:
        [ { name: 'Hello' }
        , { name: 'Lucy' }
        , { name: 'I am happy' }
        , { name: 'Life is good' }
        ]
      }
    )

    module.addSignals
    ( {
      }
    )

    return {} // meta information
  }
}
