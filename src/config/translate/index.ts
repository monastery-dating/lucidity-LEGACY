import { State } from 'app'
import { CerebralAction } from 'builder'
import { compute, Computed } from 'cerebral'
import { state, Tag } from 'cerebral/tags'
import { common } from './common'
import { en } from './en'
import { fr } from './fr'

interface BaseTranslation {
  emailPlaceholder: string
  lang: string
  passwordPlaceholder: string
  repeatPasswordPlaceholder: string
  AuthenticatingTitle: string
  Class: string
  ClassS: string
  CancelBtn: string
  DictationTab: string 
  Document: string
  DocumentS: string
  EmptyPlaceholder: string
  Folder: string
  FolderS: string
  InvalidPasswordError: string
  LogoutBtn: string
  LoginTitle: string
  LoadingTitle: string
  NavigatorTitle: string 
  NewBtn: string
  NewDocumentTitle: string
  NoTitle: string
  PasswordsDoNotMatchError: string
  RegisterBtn: string
  SaveBtn: string
  SetPasswordBtn: string
  SetPasswordTitle: string
  SignInBtn: string
  SignInWithGoogleBtn: string
  SignInWithFacebookBtn: string
  ScoreTab: string 
  Student: string
  StudentS: string
  SyncTitle: string 
  TrustKeysBtn: string
  TrustKeysCopiedBtn: string
  TrustUserBtn: string
  TrustUserTitle: string
  TypeTextHere: string
  TypeTitleHere: string
  UnlockBtn: string
  UnlockTitle: string
}


const LANG: Translators =
{ en
, fr
}

export interface Translate {
  ( key: string, mode?: string ): string
}

export interface Common {
  emailIcon: string
  passwordIcon: string
  repeatPasswordIcon: string
  AuthenticatingIcon: string
  DictationIcon: string
  ClassIcon: string
  CodeIcon: string
  DocumentIcon: string
  HomeIcon: string
  FolderIcon: string
  LogoutIcon: string
  LoadingIcon: string
  MelodySettingsIcon: string
  NavigatorIcon: string
  PatternSettingsIcon: string
  RandomizeIcon: string
  ScoreSettingsIcon: string
  SignInWithFacebookIcon: string
  SignInWithGoogleIcon: string
  ScoreIcon: string
  StudentIcon: string
  SubSettingsIcon: string
  SyncIcon: string 
  TrustIcon: string
  TrustUserIcon: string
}

export type Translation = BaseTranslation & Partial < Common >

interface Translators {
  [ key: string ]: Translation
}

function makeTranslator ( key: string ): { [ key: string ]: Translate } {
  const lang = <any> LANG [ key ]
  const comm = <any> common
  if ( process.env.NODE_ENV === 'production' ) {
    return (
      { [ key ] ( key: string, mode?: string ): string {
          const k = mode ? `${key}${mode}` : key
          const t = lang.hasOwnProperty ( k ) ? lang [ k ] : comm [ k ]
          return t === undefined ? k : t
        }
      }
    )
  } else {
    return (
      { [ key ] ( key: string, mode?: string ): string {
          const k = mode ? `${key}${mode}` : key
          const t = lang.hasOwnProperty ( k ) ? lang [ k ] : comm [ k ]
          if ( t === undefined ) {
            throw new Error ( `Missing translation for '${ key }${ mode ? `, ${ mode }` : '' }'.` )
          }
          return t
        }
      }
    )
  }
}

const TRANSLATOR = Object.assign
( {}
, ... Object.keys ( LANG ).map ( makeTranslator )
)

interface CheckTypes {
  lang: typeof State.prefs.lang
}

// computed
export const translate = compute<Translate>
( state`prefs.lang`
, ( lang: string ) => TRANSLATOR [ lang ] || TRANSLATOR.en
)
