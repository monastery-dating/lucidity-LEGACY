export default function getMarkupTag ({t}) {
  switch (t) {
    case 'B': return 'strong'
    case 'I': return 'em'
    case 'B+I': return 'strong em'
    default: return null
  }
}
