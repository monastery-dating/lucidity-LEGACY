import './style.scss'
import { ContextType, SignalsType } from '../../modules/context.type'
import { Component } from '../Component'

export const Signup =
Component
( { isSignup: [ '$signup' ]
  }
, ( { state, signals }: ContextType ) => {
    let username, password, email
    const submit = ( e ) => {
      console.log ( username, password, email )
    }
    const usernameClbk = ( e ) => username = e.traget.value ()
    const passwordClbk = ( e ) => password = e.traget.value ()
    const emailClbk = ( e ) => email = e.traget.value ()

    return <div class={{ Signup: true, Modal: true, active: !state.isSignup }}>
        <div class='wrap'>
          <p class='message'>Signup</p>
          <div class='list'>
            <div class='li'>
              <label>Username</label>
              <input on-change={ usernameClbk }
                name='username'/>
            </div>
            <div class='li'>
              <label>Email</label>
              <input on-change={ emailClbk }
                name='email'/>
            </div>
            <div class='li'>
              <label>Password</label>
              <input on-change={ passwordClbk }
                type='password'
                name='password'/>
            </div>
          </div>
          <div class='bwrap'>
            <div class='button continue'
              on-click={ submit }>
              Signup
            </div>
          </div>
        </div>
      </div>
  }
)
