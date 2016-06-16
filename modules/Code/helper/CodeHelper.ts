import * as cm from 'codemirror'
// JS mode
import 'codemirror/mode/javascript/javascript'
// Addons, extentions
import 'codemirror/keymap/vim'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/runmode/runmode'
import * as ts from 'typescript'

const CodeMirror = <any>cm // incomplete typings are annoying

export const SCRUBBER_VAR = '$scrub$'

// We copy in here the currently loaded block's scrubber so that
// we can access it from the editor.
export const wscrub = { values: [], init () {}, literals: [] }

const UNARY_AFTER = [ '=', '(', '?', ':', '[' ]

export interface LiteralScrub {
  value: number
  text: string
  ch: number
  line: number
}

export interface Scrubber {
  literals?: LiteralScrub[]
  values?: number[]
}

export module CodeHelper {

  const replaceWithScrubber =
  ( literals: number[]
  , value
  ): Object => {
    const idx = literals.push ( value ) - 1
    return `${SCRUBBER_VAR}[${idx}]`
  }

  export const scrubParse =
  ( source: string
  , literals: LiteralScrub[]
  , mode: string = 'javascript'
  ): string => {
    const output = []
    let line = 0
    let ch = 0
    CodeMirror.runMode ( source, mode, ( text, klass ) => {
      if ( text === '\n' ) {
        ++line
        ch = 0
        output.push ( text )
      }
      else {
        if ( klass === 'number' ) {
          // const foo = 4 - 5
          const idx = literals.push ( { text, line, ch, value: parseFloat ( text ) } ) - 1
          let p = output.length - 1
          let uch = ''
          let unarypos = null
          let getMinus = true

          while ( true ) {
            const op = output [ p ]
            if ( op[ 0 ] === ' ' ) {
              // whitespace
              if ( getMinus ) {
                uch = op + uch
              }

              --p
            }
            else if ( getMinus ) {
              if ( op === '-' ) {
                getMinus = false
                unarypos = p
                uch = op + uch
                --p
              }
              else {
                // not unary minus
                break
              }
            }
            else if ( UNARY_AFTER.indexOf ( op ) >= 0 ) {
              break
            }
            else {
              unarypos = null
              break
            }
          }

          const s = `${SCRUBBER_VAR}[${idx}]`
          if ( unarypos ) {
            // unary minus
            while ( output.length > unarypos ) {
              output.pop ()
            }
            output.push ( s )
            // make unary
            const l = literals [ idx ]
            l.value = - l.value
            l.text = uch + l.text
            l.ch -= uch.length
          }
          else {
            output.push ( s )
          }
        }
        else {
          output.push ( text )
        }
        ch += text.length
      }
    })
    return output.join ( '' )
  }

  export const transpile =
  ( source: string
  , scrubber?: Scrubber
  ) => {
    let src = source
    if ( scrubber ) {
      scrubber.literals = []
      src = scrubParse ( source, scrubber.literals )
      scrubber.values = scrubber.literals.map ( l => l.value )
    }
    return ts.transpile ( src )
  }

  export const editor =
  ( elm: HTMLElement
  , source: string = ''
  ): any => {
    return CodeMirror
    ( elm
    , { value: source
      , indentUnit: 2
      , scrollbarStyle: 'overlay'
      , lineWrapping: true
      , theme: 'bespin'
      , mode: 'javascript'
      , keyMap: 'vim' // FIXME: should come from user prefs
      , extraKeys: { Tab: 'indentMore', [ 'Shift-Tab' ]: 'indentLess' }
      , smartIndent: false
      }
    )
  }
}
