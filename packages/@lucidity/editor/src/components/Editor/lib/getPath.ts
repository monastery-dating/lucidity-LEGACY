
export default function getPath
( anchor: HTMLAnchorElement
) : string [] {
  const path : string [] = []
  let elem = <HTMLElement> anchor.parentElement
  while (true) {
    const ref = elem.getAttribute ( 'data-ref' )
    if ( ! ref ) {
      break
    }
    path.unshift ( ref )
    elem = <HTMLElement> elem.parentElement
  }
  return path
}
