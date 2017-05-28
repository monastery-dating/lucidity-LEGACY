import {Computed} from 'cerebral'

export default Computed(
  {
    paragraphs: 'editor.composition.paragraphs.**'
  },
  function paragraphRefList ({paragraphs}) {
    return Object.keys(paragraphs).sort((a, b) => paragraphs[a].position >= paragraphs[b].position ? 1 : -1)
  }
)
