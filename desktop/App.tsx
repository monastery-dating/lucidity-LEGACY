import './style.scss'
import './Workbench/style.scss'
import { Component } from './Component'
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
    case 'projects': return <ProjectChooser key='ProjectChooser'/>
    case 'project': return <Editor/>
    case 'user': return <User/>
    default: return <div></div>
  }
}

export const App =
Component
( { route: [ '$route' ]
  }
, ( { state } ) => {

    return <div class='App'>
        { route ( state.route ) }
        <StatusBar key='StatusBar'></StatusBar>
        <StatusDetail key='StatusDetail'></StatusDetail>
      </div>
  }
)
