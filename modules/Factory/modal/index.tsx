// FIXME: move Component to '/lib' ?
// FIXME: move Factory to '/lib' ?
// FIXME: should import styles ?
import { Component } from '../../../desktop/Component'
import { FactorySignalsType } from '../../Factory'
import { ContextType, SignalsType } from '../../context.type'

// Open/closeable pane
interface OpenModalOpts {
  message: string
  _id: string
  type: 'scene'
  operation: 'remove'
  confirm?: string
}

// We use a switch case instead of signals[ key ] to force type check.
const getSignal =
( signals: SignalsType, opts: OpenModalOpts ) => {
  switch ( opts.type ) {
    case 'scene':
      switch ( opts.operation ) {
        case 'remove':
          return signals.scene.remove
      }
    break
  }
}

const ModalPath = [ '$factory', 'modal' ]

export const openModal =
( opts : OpenModalOpts
, signals: SignalsType
) => {
  return ( e ) => {
    signals.$factory.set
    ( { path: ModalPath
      , value: Object.assign ( {}, opts, { active: true } )
      }
    )
  }
}

export const Modal = Component
( { modalOpts: ModalPath // State of the pane.
  }
, ( { state, children, signals }: ContextType ) => {
    const opts = state.modalOpts || {}

    const cancel = () => {
      signals.$factory.set
      ( { path: [...ModalPath, 'active' ], value: false } )
    }

    const continueOp = () => {
      const signal = getSignal ( signals, opts )
      if ( signal ) {
        signal ( { _id: opts.id } )
      }
      else {
        console.error ( 'Invalid signal for modal:', opts )
      }
    }

    return <div class={{ Modal: true, active: opts.active }}>
        <div class='wrap' on-click={ cancel }>
          <p class='message'>{ opts.message }</p>
          <div class='bwrap'>
            <div class='button cancel'
              on-click={ cancel }>Cancel</div>
            <div class='button continue'
              on-click={ continueOp }>
              { opts.confirm || 'Continue' }
            </div>
          </div>
        </div>
      </div>
  }
)
