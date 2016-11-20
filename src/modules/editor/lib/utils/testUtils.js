/* global jest */
const MOCK1 = JSON.stringify(
  {
    i: {
      // Block = PARAGRAPH / MEDIA LEVEL
      mcneu: {
        p: 0, // position
        t: 'P', // type <p>
        i: {
          uasuf: {
            p: 0,
            t: 'T', // <span>
            i: 'You can click '
          },
          // Link
          jnaid: {
            p: 1,
            t: 'A', // <a>
            href: 'http://example.com',
            i: {
              mnzjq: {
                p: 0,
                t: 'T',
                i: 'this '
              },
              zzvgp: {
                p: 1,
                t: 'S+E', // <span class='s e'>
                i: 'link '
              }
            }
          },
          mznao: {
            p: 2,
            t: 'T', // <span>
            i: 'to view the next '
          },
          mnahl: {
            p: 3,
            t: 'E',
            i: 'page'
          },
          ncgow: {
            p: 4,
            t: 'T',
            i: '.'
          }
        }
      },
      zhaog: {
        p: 1, // position
        t: 'P', // type <p>
        i: {
          // Markup = bold, italic, etc
          oiafg: {
            p: 0,
            t: 'T', // <span>
            i: 'This is the first '
          },
          oaiue: {
            p: 1,
            t: 'S', // <span class='s'>
            i: 'message'
          },
          haiou: {
            p: 2,
            t: 'T', // <span>
            i: '. Hello blah bomgolo frabilou elma tec.'
          }
        }
      },
      zaahg: {
        p: 2,
        t: 'P',
        i: 'This is the third paragraph. My tailor types fast.'
      }
    }
  }
)

export const mockComposition = () => JSON.parse(MOCK1)

export const caretSelection = (path, offset) => ({
  anchorPath: path,
  focusPath: path,
  anchorOffset: offset,
  focusOffset: offset,
  type: 'Caret'
})

export const rangeSelection = (anchorPath, anchorOffset, focusPath, focusOffset) => ({
  anchorPath,
  focusPath,
  anchorOffset,
  focusOffset,
  type: 'Caret'
})
