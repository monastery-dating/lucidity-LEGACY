/** A time information object.

All units are in seconds, with `now = 0` representing the start of an animation.

Note that 'dt' can be negative if the animation loops and that `now` can also be negative (for pre-count, view setup scenes, etc).

*/
export namespace animation {
  export interface Time {
    now: number
    dt: number
  }
}
