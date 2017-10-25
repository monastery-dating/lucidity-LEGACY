import { State } from 'app'
import { compute } from 'cerebral'
import { state } from 'cerebral/tags'
import { Theme } from 'styled'
import { basic } from './basic'

interface Themes {
  [ key: string ]: Theme
}

export const themes: Themes =
{ basic
}

export const theme = compute<Theme>
( state`prefs.theme`
, ( name: typeof State.prefs.theme ) => {
    return themes [ name ] || themes.basic
  }
)
