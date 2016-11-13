import {input, set, state} from 'cerebral/operators'

export default {
  state: {
    $draft: {
      one: {
        ref: 'one',
        position: 0.0,
        type: 'P',
        text: 'This is the first message. Hello blah bomgolo frabilou elma tec.',
        markup: {
          iahyx: {
            start: 18,
            end: 25,
            type: 'STRONG'
          }
        }
      },
      two: {
        ref: 'two',
        position: 2.0,
        type: 'P',
        text: 'This is the second <b>message</b>. Hello blah bomgolo frabilou elma tec.'
      },
      three: {
        ref: 'three',
        position: 3.0,
        type: 'P',
        text: 'This is the third **message**. Hello blah bomgolo frabilou elma tec.'
      }
    }
  },
  signals: {
    draftChanged: [
      set(state`editor.$draft.${input`key`}`, input`value`)
    ]
  }
}
