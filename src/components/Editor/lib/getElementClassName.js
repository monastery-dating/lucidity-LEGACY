export default function getMarkupTag (type) {
  switch (type) {
    case 'S': return 'strong'
    case 'E': return 'em'
    case 'S+E': return 'strong em'
    default: return null
  }
}
