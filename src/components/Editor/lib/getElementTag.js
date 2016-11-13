export default function getMarkupTag (type) {
  switch (type) {
    case 'P': return 'p'
    case 'A': return 'a'
    default: return 'span'
  }
}
