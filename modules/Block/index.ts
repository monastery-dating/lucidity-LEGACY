// Exposed actions and signals from Data (used directly in other signals composition)

export const Block =
( options = {} ) => {
  return (module, controller) => {
    // This state is where we read and write to
    // the database
    module.addState
    ( { source: ''
      }
    )

    return {} // meta information
  }
}
