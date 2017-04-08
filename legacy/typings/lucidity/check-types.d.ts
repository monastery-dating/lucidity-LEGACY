// Type definitions for [LIBRARY NAME]
// Project: [LIBRARY URL]
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'check-types' {
  interface ArrayType {
    of: CheckTypes
  }
  interface CheckTypes {
    number: any
    string: any
    like: any
    array: ArrayType
    undefined: any
    not: CheckTypes
    maybe: CheckTypes
    assigned: any
  }
  const dummy: CheckTypes
  export = dummy
}
