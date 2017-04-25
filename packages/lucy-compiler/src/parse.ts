/** Parse a string and return a Project
 * definition.
 */
import 
  { BasicBlockType
  , FragmentType
  , Project, SerializedBranch, SourceFragment } from './types'
import { extractSources } from './extractSources'
import * as marked from 'marked'
import * as yaml from 'js-yaml'

const HEAD_RE = /^((@|\$)([^\.]+)\.?(.*))$/

const defaultOp = ( text: string ) => text || ''
const defaultOpNoArg = () => ''

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
        , sources: { name: 'source', sources: [] } 
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
        const content: SerializedBranch = yaml.load ( text )
        const { lucidity, branch, entry, nodes, blocks } = content
        const type = lucidity
        if ( type === 'branch' ) {
          branches.push
          ( { branch
            , entry
            , nodes
            } 
          )
          Object.keys ( blocks )
          .forEach
          ( key => {
              const sblock = blocks [ key ]
              if ( ! sblock.lang ) {
                sblock.lang = 'ts'
              }
              if ( blockById [ key ] ) {
                throw new Error ( `Duplicate block id '${key}'.`)
              }
              if ( ! sblock.name ) {
                throw new Error ( `Missing 'name' in block id '${key}.`)
              }
              const block: BasicBlockType = Object.assign
              ( {}, sblock, { id: key } )

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
