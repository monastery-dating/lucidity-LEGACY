// import colorChanged from './signals/colorChanged';

export default (options = {}) => {
  return (module, controller) => {
    console.log ( 'loading library' )
    module.addState
    ( { $rows:
        [ { name: 'Hello' }
        , { name: 'World' }
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
