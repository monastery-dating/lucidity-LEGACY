import React from 'react'
import Element from './Element'

export default function expandInner (path, inner) {
  return Object.keys(inner)
  .sort((a, b) => inner[a].p >= inner[b].p ? 1 : -1)
  .map(elemRef => (
    <Element
      path={path + '.i.' + elemRef}
      key={elemRef}
      elemRef={elemRef} />
  ))
}
