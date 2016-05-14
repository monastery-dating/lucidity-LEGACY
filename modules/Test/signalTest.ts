// modules

// import Router from 'cerebral-module-router'
import { SignalType } from '../context.type'
import * as Controller from 'cerebral'
import * as Model from 'cerebral-model-baobab'

const testModule =
( signal: SignalType ) => ( module, controller ) => {
  module.addSignals ( { signal } )
}

export const signalTest =
( state: any
, asignal: SignalType
, services?: any
) => {
  const model = Model ( state || {} )
  const controller = Controller ( model )
  const mod = testModule ( asignal )

  controller.addModules
  ( { mod
    }
  )

  if ( services ) {
    controller.addServices ( services )
  }

  const signal = controller.getSignals ().mod.signal
  const send = ( input, clbk ) => {
    controller.on ( 'signalEnd', () => clbk ( controller ) )
    signal ( input )
  }
  return send
}
