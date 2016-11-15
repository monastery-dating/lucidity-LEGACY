
export default function createBlock ({input, state}) {
  const {anchorPath, anchorOffset, focusPath, focusOffset} = input.selection
  // What is before anchor in anchor block  ==> stays in anchor
  console.log(anchorPath, anchorOffset, focusPath, focusOffset)
  // What is after focus in focus block ==> goes into new block
}
