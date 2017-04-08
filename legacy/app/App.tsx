import './style.scss'
import './Workbench/style.scss'
import { Component } from './Component'
import { ContextType } from '../modules/context.type'
import { Editor } from './Editor'
import { Login } from './Login'
import { ProjectChooser } from './ProjectChooser'
import { Signup } from './Signup'
import { StatusBar } from './StatusBar'
import { StatusDetail } from './StatusDetail'
import { User } from './User'

const route =
( r ) => {
  switch ( r ) {
    case 'login': return <Login key='Login'/>
    case 'project': return <Editor/>
    case 'user': return <User/>
    case 'home': // continue
    case 'projects': // continue
    default: return <ProjectChooser key='ProjectChooser'/>
  }
}

export const App =
Component
( { route: [ '$route' ]
  , mode: [ '$playback', 'mode' ]
  }
, ( { state, signals }: ContextType ) => {
    const klass = { App: true, [ state.mode || 'normal' ]: true }

    return <div class={ klass }>
        <div class='wrap'>{ route ( state.route ) }</div>
        <StatusBar/>
        <StatusDetail key='StatusDetail'/>
      </div>
  }
)
