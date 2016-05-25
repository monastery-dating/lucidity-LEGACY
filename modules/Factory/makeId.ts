let counter = 0
export const makeId =
() => {
  // ensures unique DB id
  const date = new Date().toISOString ()
  return `${date}-${++counter}`
}
