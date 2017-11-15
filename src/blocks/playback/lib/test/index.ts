import { readFileSync } from 'fs'
import { extname, join } from 'path'

// FIXME: find a way to set ROOT during compilation...
const ROOT = '/Users/gaspard/git/lucidity/src/blocks/playback/lib/test'

export function source
( filename: string
): string {
  const ext = extname ( filename ).slice ( 1 )
  return readFileSync
  ( join ( ROOT, 'fixtures', ext, filename ), 'utf8' )
}