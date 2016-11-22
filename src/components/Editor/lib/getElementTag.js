export default function getMarkupTag ({t, o}) {
  switch (t) {
    case 'P':
      if (o && o.h) {
        return `h${o.h}`
      } else {
        return 'p'
      }
      break
    case 'A': return 'a'
    default: return 'span'
  }
}
