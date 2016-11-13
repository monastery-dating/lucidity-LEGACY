export default function getMarkupTag (type) {
  switch (type) {
    case 'STRONG': return 'strong'
    default: return 'span'
  }
}
