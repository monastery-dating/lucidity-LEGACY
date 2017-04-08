import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { editable } from '../../modules/Factory'


const GithubToken = editable ( [ 'user', 'libraryGithubToken' ] )
const GithubPath  = editable ( [ 'user', 'libraryGithubPath' ] )
const UserName    = editable ( [ 'user', 'name' ] )

const showFiles =
( entries ) => {
  return Object.keys ( entries || {} ).sort ().map
  ( s => <div class='li'>{ s }</div> )
}

export const User =
Component
( { user: [ 'user' ]
  , files: [ 'github', 'library' ]
  , editing: [ '$factory', 'user' ]
  }
, ( { state, signals }: ContextType ) => (
    <div class={{ User: true, Modal: true, active: true }}>
      <div class='wrap'>
        <p class='message'>
          User preferences
        </p>
        <div class='list'>
          <div class='li'>
            <UserName/>
          </div>
          <div class='li'>
            <GithubToken default='somelongauthtoken'/>
          </div>
          <div class='li'>
            <GithubPath default='user'/>
          </div>
        </div>
        <div class='list'>
          { showFiles ( state.files ) }
        </div>
      </div>
    </div>
  )
)
