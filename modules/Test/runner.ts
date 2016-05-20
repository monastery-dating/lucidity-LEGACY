import * as deepEqual from 'deep-equal'

const DEFAULT_TIMEOUT = 3000
const NO_ERR = { message: 'did not throw' }

interface Assert {
  same<T> ( a: T, b: T ): void
  notSame<T> ( a: T, b: T): void
  equal<T> ( a: T, b: T ): void
  pending ( msg: string ): void
  throws ( fun: Function, re?: RegExp ): void
}

interface Done {
  (): void
}

interface TestFunction {
  ( assert: Assert, done?: Done ) : void
}

interface ItCallback {
  ( name: string, test: TestFunction )
}

interface DescribeCallback {
  ( it: ItCallback )
}

interface Test {
  suiteName: string
  testName: string
  test: TestFunction
  async: Boolean // true in Failure when running outside try/catch
}

interface Suite {
  name: string
  tests: Test[]
}

const suites: Suite[] = []

export const describe = function
( name: string
, clbk: DescribeCallback
) {
  const suite: Suite = { name, tests: [] }
  suites.push ( suite )
  const it = ( testname: string, test: TestFunction ) => {
    suite.tests.push
    ( { suiteName: name
      , testName: testname
      , test
      , async: test.length === 2
      }
    )
  }
  clbk ( it )
}

const defaultSuccess : OnSuccess =
( { suiteName, testName } ) => {
  // console.log ( `PASS: ${ suiteName } ${ testName }` )
}

const defaultPending: OnFail =
( { suiteName, testName, actual } ) => {
  console.log ( `PEND: ${ suiteName } ${ testName }` )
  console.log ( actual )
  return true
}

export const failureMessage =
( f: Failure ) => {
  const m = []
  m.push ( `FAIL: ${ f.suiteName } ${ f.testName }` )
  switch ( f.assertion ) {
    case 'timeout':
      m.push ( 'timeout exceeded', f.actual )
      break
    case 'notSame':
      m.push ( 'expected', f.actual )
      m.push ( 'to not be', f.expected )
      break
    case 'same':
      m.push ( 'expected', f.actual )
      m.push ( 'to be', f.expected )
      break
    case 'equal':
      m.push ( 'expected' )
      m.push ( JSON.stringify ( f.actual, null, 2 ) )
      m.push ( 'to equal' )
      m.push( JSON.stringify ( f.expected, null, 2 ) )
      break
    default:
    case 'throws':
      m.push ( f.assertion )
  }
  m.push ( f.error )
  return m.join ( '\n' ) // continue
}

const defaultFail : OnFail =
( f: Failure ) => {
  console.log ( failureMessage ( f ) )
  return true // continue
}

interface OnSuite {
  ( suite: Suite ): void
}

interface OnTest {
  ( test: Test ): void
}

interface OnSuccess {
  ( test: Test )
}

interface OnFail {
  ( failure: Failure ): Boolean
}

export interface Failure extends Test {
  error: Error
  expected: any
  actual: any
  assertion: 'same' | 'notSame' | 'equal' | 'pending' | 'timeout' | 'exception' | 'throws'
}

export interface TestStats {
  testCount: number
  passCount: number
  failCount: number
  pendingCount: number
  assertCount: number
  failures: Failure[]
}

const makeAssert = function
( f: Failure
, stats: TestStats
): Assert {
  return {
      same ( a, b ) {
        stats.assertCount += 1
        f.assertion = 'same'
        f.actual   = a
        f.expected = b
        if ( a !== b ) {
          f.error = new Error ( `${ a } !== ${ b }` )
          if ( f.async ) {
            // we do not throw in async code because we
            // cannot catch
          }
          else {
            throw f.error
          }
        }
      }
    , notSame ( a, b ) {
        stats.assertCount += 1
        f.assertion = 'notSame'
        f.actual   = a
        f.expected = b
        if ( a === b ) {
          f.error = new Error ( `${ a } === ${ b }` )
          if ( f.async ) {
            // we do not throw in async code because we
            // cannot catch
          }
          else {
            throw f.error
          }
        }
      }
    , equal ( a, b ) {
        stats.assertCount += 1
        f.assertion = 'equal'
        f.actual   = a
        f.expected = b
        if ( !deepEqual ( a, b, { strict: true } ) ) {
          f.error = new Error ( `!deepEqual ( ${ a }, ${ b } )` )
          if ( f.async ) {
            // we do not throw in async code because we
            // cannot catch
          }
          else {
            throw f.error
          }
        }
      }
    , throws ( func, regex: RegExp ) {
        f.assertion = 'throws'
        f.expected = regex
        let err = NO_ERR
        try {
          func ()
        }
        catch ( e ) {
          err = e
        }

        if ( err === NO_ERR || (regex && !regex.test ( err.message )) ) {
          if ( regex ) {
            f.error = new Error ( `${ err.message } does not match ${ regex }` )
          }
          else {
            f.error = new Error ( `${ err.message }` )
          }
          if ( f.async ) {
            // we do not throw in async code because we
            // cannot catch
          }
          else {
            throw f.error
          }
        }
      }
    , pending ( m ) {
        f.assertion = 'pending'
        f.actual = m
        f.error = new Error ( m )
        if ( f.async ) {
          // we do not throw in async code because we
          // cannot catch
        }
        else {
          throw f.error
        }
      }
    }
}

interface OnFinish {
  ( r: TestStats ): void
}

interface RunOpts {
  onsuccess?: OnSuccess // = defaultSuccess
  onfail?: OnFail  // = defaultFail
  onpending?: OnFail // = defaultPending
  onsuite?: OnSuite
  ontest?: OnTest
}

const runNext = function ( gen, f ) {
  const tim = gen.next ().value
  if ( tim ) {
    // async yield
    setTimeout
    ( () => tim.next ? f () : null
    , tim.timeout
    )
  }
  // done ( onfinish called from generator )
}

export const run = function
( onfinish: OnFinish
, opts?: RunOpts ) {
  let gen
  const f = () => runNext ( gen, f )
  gen = testGen ( onfinish, opts || {}, f )
  f ()
}

const testGen = function*
( onfinish: OnFinish
, { onsuccess = defaultSuccess
  , onfail = defaultFail
  , onpending = defaultPending
  , onsuite
  , ontest
  } : RunOpts
, forward
) {
  let failures: Failure[] = []
  const stats =
  { testCount: 0, failCount: 0, passCount:0, pendingCount: 0
  , assertCount: 0
  , failures
  }
  let failure = <Failure> {}
  let assert = makeAssert ( failure, stats )
  const pass = ( test ) => {
    // PASS
    stats.passCount += 1
    onsuccess ( test )
  }

  const fail = ( test, error ): Boolean => {
    Object.assign ( failure, { error }, test )
    failures.push ( failure )

    if ( failure.assertion === 'pending' ) {
      stats.pendingCount += 1
      onpending ( failure )
    }

    else {
      stats.failCount += 1
      if ( ! onfail ( failure ) ) {
        // abort
        onfinish ( stats )
        return true
      }
    }
    failure = <Failure> {}
    assert = makeAssert ( failure, stats )
    return false
  }

  const done = () => {
    // clear
    failure.async = false
    forward ()
  }

  for ( const suite of suites ) {
    if ( onsuite ) {
      onsuite ( suite )
    }
    for ( const test of suite.tests ) {
      stats.testCount += 1
      if ( ontest ) {
        ontest ( test )
      }

      try {
        if ( test.async ) {
          test.test ( assert, done )
          // continue with async
          failure.async = true
          const tim =
          { timeout: DEFAULT_TIMEOUT
          , next: true // call next on timeout
          }
          yield tim
          if ( failure.async ) {
            // timed out
            failure.assertion = 'timeout'
            failure.actual = DEFAULT_TIMEOUT
            if ( fail ( test, 'timeout' ) ) {
              yield // abort
            }
          }
          else if ( failure.error ) {
            tim.next = false // on timeout do nothing
            // assertion failure
            if ( fail ( test, failure.error ) ) {
              yield // abort
            }
          }
          else {
            tim.next = false
            // pass
            pass ( test )
          }
        }
        else {
          test.test ( assert )
          pass ( test )
        }
      }
      catch ( error ) {
        // FAIL
        if ( !failure.error ) {
          // exception in user code
          failure.assertion = 'exception'
        }
        if ( fail ( test, error ) ) {
          yield // abort
        }
      }
    }
  }
  // all done
  onfinish ( stats )
}
