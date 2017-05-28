// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'cerebral' {
  interface Cerebral {
    Controller ( any ): any
    Computed ( props: any, compute: any ): any
  }
  const module: Cerebral
  export = module
}

declare module 'cerebral/react' {
  interface CerebralReact {
    StateContainer ( any ): any
    Container ( any ): any
    connect ( props: any, signals: any, comp: any ): any
    connect ( props: any, comp: any ): any
    connect ( props: any, signals: any, comp: ( props: any ) => void): any
    connect ( props: any, comp: ( props: any ) => void ): any
  }
  const module: CerebralReact
  export = module
}

declare module 'cerebral/devtools' {
  interface DevOptions {
    remoteDebugger: string
  }
  interface DevTools {
    default ( DevOptions ): any
  }
  const module: DevTools
  export = module
}

declare module 'cerebral/tags' {
  interface Tags {
    props ( path: TemplateStringsArray, ...values: any[] ): any
    signal ( path: TemplateStringsArray, ...values: any[] ): any
    state ( path: TemplateStringsArray, ...values: any[] ): any
    string ( path: TemplateStringsArray, ...values: any[] ): any
  }
  const module: Tags
  export = module
}

declare module 'cerebral/operators' {
  interface Operators {
    set ( path: TemplateStringsArray, ...values: any[] ): any 
    merge ( path: TemplateStringsArray, ...values: any[] ): any 
    signal ( path: TemplateStringsArray, ...values: any[] ): any
    string ( path: TemplateStringsArray, ...values: any[] ): any
    toggle ( path: TemplateStringsArray, ...values: any[] ): any
    unset ( path: TemplateStringsArray, ...values: any[] ): any
    when ( path: TemplateStringsArray, ...values: any[] ): any
  }
  const module: Operators
  export = module
}