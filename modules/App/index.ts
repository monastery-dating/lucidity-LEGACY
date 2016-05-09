import mounted from './signals/mounted'

interface Foo {
  bar: string
}

export default (options = {}) => {
  return (module, controller) => {
    // no state added

    module.addSignals
    ( { mounted
      }
    )

    return {} // meta information
  }
}
