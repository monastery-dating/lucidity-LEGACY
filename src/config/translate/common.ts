import { Common } from '../translate'

export const common: Common =
{ emailIcon: 'fa-envelope-o'
, passwordIcon: 'fa-key'
, repeatPasswordIcon: 'fa-key'
, AuthenticatingIcon: 'fa-key'
, BranchIcon: 'fa-cube'
, ClassIcon: 'fa-users'
, CodeIcon: 'fa-code'
, DictationIcon: 'fa-headphones'
, DocumentIcon: 'fa-file-text-o'
, FolderIcon: 'fa-folder-open'
, HomeIcon: 'fa-home'
, LatexIcon: 'fa-flask'
, LogoutIcon: 'fa-sign-out'
, LoadingIcon: 'fa-spinner lu-pulse fa-fw'
, MelodySettingsIcon: 'fa-ellipsis-v'
, NavigatorIcon: 'fa-address-book-o'
, PatternSettingsIcon: 'fa-ellipsis-h'
, RandomizeIcon: 'fa-refresh'
, ScoreIcon: 'fa-music'
, ScoreSettingsIcon: 'fa-cog'
, SignInWithFacebookIcon: 'fa-facebook'
, SignInWithGoogleIcon: 'fa-google'
, StudentIcon: 'fa-graduation-cap'
, SubSettingsIcon: 'fa-cog'
, SyncIcon: 'fa-cog lu-spin fa-fw'
, TrustIcon: 'fa-user-circle'
, TrustUserIcon: 'fa-user-circle'
}

import { connect } from 'builder'
import { state, props } from 'cerebral/tags'
interface State {
  things: {
    [ key: string ]: {
      title: string,
      description: string
    }
  }
}

const propsPaths = {
  id: 'id'
}

const statePaths = {
  things: {
    __path: state`things`,
    id: {
      __path: state`things.${ props`id` }`,
      title: { __path: state`things.${ props`id` }.title` },
      description: { __path: state`things.${ props`id` }.description` }
    }
  }
}

interface Props {
  id: string
}

interface Getters {
  state: State
  props: Props
}

function connect2<T> ( mapper: ( getters: Getters ) => T, comp: ( props: T ) => any ): any {
  const getters = { state: statePaths, props: propsPaths }
  const map = <any> mapper ( <any> getters )
  const newMap =
  Object.assign
  ( {}
  , ... Object.keys ( map ).map
        ( k => ( { [ k ]: map [ k ].__path } ) )
  )
  return connect ( newMap, comp )
}

connect2
( s => ( { title: s.state.things [ s.props.id ].title } )
, function foo ( { title } ) {

  }
)