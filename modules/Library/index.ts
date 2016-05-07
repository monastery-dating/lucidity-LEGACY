// import colorChanged from './signals/colorChanged';

export default (options = {}) => {
  return (module, controller) => {
    console.log ( 'loading library' )
    module.addState
    ( { $rows:
        [ { name: 'One' }
        , { name: 'Two' }
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
