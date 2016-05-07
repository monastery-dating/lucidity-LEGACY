// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "snabbdom" {
  interface Patch {
    ( domElement: any, vnode: any ): void
  }
  export function init ( modules: any ): Patch
}

declare module "snabbdom-jsx" {
  export function html ( any ): any
}

declare module "snabbdom/modules/class" {
  const dummy: any
  export default dummy
}

declare module "snabbdom/modules/props" {
  const dummy: any
  export default dummy
}

declare module "snabbdom/modules/style" {
  const dummy: any
  export default dummy
}

declare module "snabbdom/modules/eventlisteners" {
  const dummy: any
  export default dummy
}
