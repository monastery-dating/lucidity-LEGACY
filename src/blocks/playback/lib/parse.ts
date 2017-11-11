/** Parse a string and return a Project
 * definition.
 */
import 
  { FragmentType
  , Project, BranchDefinition, SourceFragment } from './types'
import { extractSources } from './extractSources'
import * as marked from 'marked'
import * as yaml from 'js-yaml'

const HEAD_RE = /^((@|\$)([^\.]+)\.?(.*))$/

const defaultOp = ( text: string ) => text || ''
const defaultOpNoArg = () => ''

const TYPE_RE = /^#\s*type\s*:\s*(.+)$/

function getType ( text: string ): string | undefined {
  const re = TYPE_RE.exec ( text )
  if ( re ) {
    return re [ 1 ]
  }
}

export function parse
( text: string
): Project {
  const result: Project =
  { branches: [], blockById: {}, blocksByName: {}, fragments: {} }

  const { branches, blockById, blocksByName, fragments } = result

  let fragment: SourceFragment
  let tname: string | undefined
  let tlevel: number = 0

  const renderer =
  { heading ( text: string, level: number ) {
      if ( level <= tlevel ) {
        // done with current target block
        tlevel = 0
      }
      const re = HEAD_RE.exec ( text )
      if ( re ) {
        const type = < FragmentType > re [ 2 ]
        const name = re [ 3 ]
        const frag = re [ 4 ]
        let lang: string
        if ( type === '@' ) {
          const list = blocksByName [ name ]
          if ( ! list ) {
            throw new Error ( `Block source defined before graph.` )
          }
          lang = list [ 0 ].lang || 'ts'
        } else {
          const block = blockById [ name ]
          if ( ! block ) {
            throw new Error ( `Block source '${name}' defined before graph.` )
          }
          lang = block.lang || 'ts'
        }
        fragment =
        { target: name
        , type, frag, lang
        // dummy values for 'source' and 'sources'
        , source: ''
        , sources: []
        }
        fragments [ text ] = fragment
        tlevel = level
      }
      return ''
    }
  , text ( text: string ) {
      return text
    }
  , paragraph ( text: string ) {
      return ''
    }
  , code ( text: string, lang: string ) {
      if ( lang === 'yaml' ) {
        const type = getType ( text )
        const content: BranchDefinition = yaml.load ( text )
        const { branch, entry, blocks } = content
        if ( type === 'branch' ) {
          branches.push
          ( content)
          Object.keys ( blocks )
          .forEach
          ( key => {
              const block = blocks [ key ]
              if ( ! block.lang ) {
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

              if ( ! list ) {
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

      if ( fragment && lang === fragment.lang ) {
        const s = fragment.source
        fragment.source = s === ''
          ? text
          : s + '\n' + text
        return ''
      }

      return ''
    }
  , strong: defaultOp
  , codespan: defaultOp
  , blockquote: defaultOp
  , html: defaultOp
  , hr: defaultOpNoArg
  , list: defaultOp
  , listitem: defaultOp
  , table: defaultOp
  , tablerow: defaultOp
  , tablecell: defaultOp
  , em: defaultOp
  , br: defaultOpNoArg
  , del: defaultOp
  , link: defaultOp
  , image: defaultOp
  }

  marked ( text, { renderer } )
  // console.log ( JSON.stringify ( result, null, 2 ) )
  Object.keys ( fragments )
  .forEach
  ( key => {
      const frag = fragments [ key ]
      frag.sources =
      extractSources ( frag.source, frag.lang ).sources
    }
  )
  return result
}
