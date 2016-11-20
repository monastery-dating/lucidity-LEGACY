export default function getMarkupTag (type) {
  switch (type) {
    case 'B': return 'strong'
    case 'I': return 'em'
    case 'B+I': return 'strong em'
    default: return null
  }
}
