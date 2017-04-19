/** Parse a string and return a Project
 * definition.
 */
import { Project } from './types'
import * as marked from 'marked'
import * as yaml from 'js-yaml'

const HEAD_RE = /^((@|\$)([^\.]+)\.?(.*))$/

export function parse
( text: string
): any {
  const elements: any [] = []
  const sources: any = {}
  const branches: any = []
  const blockById: any = {}
  const blocksByName: any = {}
  const targets: any = {}
  const result = { branches, blockById, blocksByName, targets }
  let target: any
  let tname: string | undefined
  let tlevel: number = 0

  const renderer =
  { heading ( text: string, level: number ) {
      elements.push ( { t: 'h', level, text } )
      if ( level <= tlevel ) {
        // done with current target block
        tlevel = 0
      }
      const re = HEAD_RE.exec ( text )
      if ( re ) {
        const type = re [ 2 ]
        const name = re [ 3 ]
        const frag = re [ 4 ]
        let lang: string
        if ( type === '@' ) {
          const list = blocksByName [ name ]
          if ( !list ) {
            throw new Error ( `Block source defined before graph.` )
          }
          lang = list [ 0 ].lang || 'ts'
        } else {
          const block = blockById [ name ]
          if ( !block ) {
            throw new Error ( `Block source '${name}' defined before graph.` )
          }
          lang = block.lang || 'ts'
        }
        target = { target: name, type, frag, lang, sources: [''] }
        targets [ text ] = target
        tlevel = level
      }
      return ''
    }
  , text ( text: string ) {
      return text
    }
  , paragraph ( text: string ) {
      elements.push ( { t: 'p', text } )
      return ''
    }
  , code ( text: string, lang: string ) {
      if ( lang === 'yaml' ) {
        const content = yaml.load ( text )
        const type = content.lucidity
        if ( type === 'graph' ) {
          branches.push ( content )
          const blocks = content.blocks || {}
          Object.keys ( blocks )
          .forEach
          ( key => {
              const block = { ...blocks [ key ], id: key }
              if ( !block.lang ) {
                block.lang = 'ts'
              }
              if ( blockById [ key ] ) {
                throw new Error ( `Duplicate block id '${key}'.`)
              }
              if ( ! block.name ) {
                throw new Error ( `Missing 'name' in block id '${key}.`)
              }
              blockById [ key ] = block
              let list = blocksByName [ block.name ]
              if ( !list ) {
                list = []
                blocksByName [ block.name ] = list
              } else if ( list [ 0 ].lang !== block.lang ) {
                throw new Error ( `Blocks of the same name should share the same lang.` )
              }
              list.push ( block )
            }
          )
          return ''
        }
      }

      if ( target && lang === target.lang ) {
        target.sources.push ( text )
        return ''
      }

      elements.push ( { t: 'code', lang, text } )
      return ''
    }
    // **strong**
  , strong ( text: string ) {
      return text
    }
    // `foo` in text
  , codespan ( text: string ) {
      return text
    }
  }

  marked ( text, { renderer } )
  return result
}
