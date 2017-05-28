import { readFileSync } from 'fs'
import { extname, join } from 'path'

export function source
( filename: string
): string {
  const ext = extname ( filename ).slice ( 1 )
  return readFileSync
  ( join ( __dirname, 'fixtures', ext, filename ), 'utf8' )
}