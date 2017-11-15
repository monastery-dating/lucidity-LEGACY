/** Parse a string and return a Project
 * definition.
 */
import 
  { FragmentType
  , Project, BranchDefinition, SourceFragment } from './types'
import { extractSources } from './extractSources'
import { v4 } from 'uuid'
import * as marked from 'marked'
import * as yaml from 'js-yaml'

import { newProject } from './project'
import { LiveProject } from 'blocks/playback';

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
): LiveProject {
  const project = newProject ()

  let fragmentId: string
  let fragmentLang: string
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
          const list = project.blocksByName [ name ]
          if ( ! list ) {
            throw new Error ( `Block source defined before graph.` )
          }
          lang = list [ 0 ].lang || 'ts'
        } else {
          const block = project.blockById [ name ]
          if ( ! block ) {
            throw new Error ( `Block source '${name}' defined before graph.` )
          }
          lang = block.lang || 'ts'
        }

        fragmentId = v4 ().slice ( 0, 10 )
        fragmentLang = lang

        /*
         FIXME
        project.loadFragment
        ( { id: fragmentId
          , target: name
          , type, frag, lang
          // dummy values for 'source' and 'sources'
          , source: ''
          , sources: []
          }
        )
        */
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
        if ( type === 'branch' ) {
          const branch: BranchDefinition = yaml.load ( text )
          // FIXME
          // project.loadBranch ( branch )
          return ''
        }
      }

      if ( fragmentId && lang === fragmentLang ) {
        // FIXME
        // project.appendSource ( project, fragmentId, text )
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

  return project
}
