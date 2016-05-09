// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace Cerebral {
  interface Controller {
    addModules ( opts: any )
    getSignals ( path?: string ) : any
  }
}

declare module "cerebral" {
  interface MakeController {
    ( model: any ): Cerebral.Controller
  }
  const dummy: MakeController
  export = dummy
}

declare module "cerebral-module-devtools" {
  interface DevTools {
    (): any
  }
  const dummy: DevTools
  export = dummy
}

declare module "cerebral-module-http" {
  interface Http {
    (): any
  }
  const dummy: Http
  export = dummy
}

declare module "cerebral-model-baobab" {
  interface Model {
    ( initState: Object ): any
  }
  const dummy: Model
  export = dummy
}

declare module "cerebral-view-snabbdom" {
  interface CreateElement {
    ( tag: string, ...args ): any
  }
  interface ComponentParams {
    state: any
    signals: any
    props: any
  }
  interface ComponentClbk {
    ( options: ComponentParams ): void
  }
  interface ComponentType {
    DOM: CreateElement
    DOMh: CreateElement
    createElement: CreateElement
    ( opts: Object, clbk: ComponentClbk ): any
    ( clbk: ComponentClbk ): any
  }
  interface renderType {
    ( clbk: () => any
    , domElement:HTMLElement
    , controller: Cerebral.Controller ): void
  }
  export const Component: ComponentType
  export const render: renderType
}
