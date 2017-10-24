export default function getMarkupTag
( { t, o }: { t: string, o: { h: number } }
) : string {
  switch ( t ) {
    case 'P':
      if (o && o.h) {
        return `h${o.h}`
      } else {
        return 'p'
      }
    case 'A': return 'a'
    default: return 'span'
  }
}
