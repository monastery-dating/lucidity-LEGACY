// Function not used. Could be removed I think.
const TEXT_BLOCKS = {
  P: true,
  H: true,
  T: true
}

/** Return true if the current element is a text block.
*/
export default function isTextBlock ({t, i}) {
  return (TEXT_BLOCKS[t] || false) && (typeof i === 'string')
}
