import {input, set, state} from 'cerebral/operators'

export default {
  state: {
    composition: {
      i: {
        // Block = PARAGRAPH / MEDIA LEVEL
        zhaog: {
          p: 0.0, // position
          t: 'P', // type <p>
          i: {
            // Markup = bold, italic, etc
            oiafg: {
              p: 0.0,
              t: 'T', // <span>
              i: 'This is the first '
            },
            oaiue: {
              p: 1.0,
              t: 'S', // <span class='s'>
              i: 'message'
            },
            haiou: {
              p: 2.0,
              t: 'T', // <span>
              i: '. Hello blah bomgolo frabilou elma tec.'
            }
          }
        },
        mcneu: {
          p: 0.0, // position
          t: 'P', // type <p>
          i: {
            uasuf: {
              p: 0.0,
              t: 'T', // <span>
              i: 'You can click '
            },
            // Link
            jnaid: {
              p: 1.0,
              t: 'A', // <a>
              href: 'http://example.com',
              i: {
                mnzjq: {
                  p: 0.0,
                  t: 'T',
                  i: 'this '
                },
                zzvgp: {
                  p: 1.0,
                  t: 'S+E', // <span class='s e'>
                  i: 'link '
                }
              }
            },
            mznao: {
              p: 2.0,
              t: 'T', // <span>
              i: 'to view the next '
            },
            mnah: {
              p: 3.0,
              t: 'E',
              i: 'page'
            },
            ncgw: {
              p: 4.0,
              t: 'T',
              i: '.'
            }
          }
        },
        zaahg: {
          p: 3.0,
          t: 'P',
          i: 'This is the third paragraph. Hello blah bomgolo frabilou elma tec.'
        }
      }
    }
  },
  signals: {
    contentChanged: [
      set(state`editor.composition.i.${input`path`}`, input`value`)
    ]
  }
}
