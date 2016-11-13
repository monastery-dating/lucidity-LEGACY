export default function getMarkupTag (type) {
  switch (type) {
    case 'P': return 'p'
    default: return 'div'
  }
}
