import React from 'react'
import getMarkupTag from './getMarkupTag'

export default function parseMarkup ({ref, markup, text}) {
  if (!markup) {
    return text
  }

  const result = []
  let last = 0

  const marks = Object.keys(markup)
  .map(mref => markup[mref])
  .sort((a, b) => a.start >= b.start ? 1 : -1)

  marks.forEach((mark, idx) => {
    const key1 = `${ref}-${last}`
    result.push(<span key={key1} data-ref={key1}>{text.substr(last, mark.start)}</span>)
    last = mark.end

    const inner = text.substr(mark.start, mark.end - mark.start)
    const Tag = getMarkupTag(mark.type)
    const key2 = `${ref}-${mark.start}-${mark.ref}`
    result.push(<Tag key={key2} data-ref={key2}>{inner}</Tag>)
  })

  if (last < text.length) {
    const key = `${ref}-${last}`
    result.push(<span key={key} data-ref={key}>{text.substr(last)}</span>)
  }
  return result
}
