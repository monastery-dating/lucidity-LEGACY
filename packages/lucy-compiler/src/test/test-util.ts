import { readFileSync } from 'fs'
import * as path from 'path'

declare var __dirname: any

export function projectMarkdown
( projectName: string
): string {
  return readFileSync
  ( path.join ( __dirname, `${projectName}.md` ), 'utf8' )
}