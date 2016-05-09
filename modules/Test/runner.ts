import * as deepEqual from 'deep-equal'

interface Assert {
  same<T> ( a: T, b: T ): void
  notSame<T> ( a: T, b: T): void
  equal<T> ( a: T, b: T ): void
}

interface TestFunction {
  ( assert: Assert ) : void
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
      }
    )
  }
  clbk ( it )
}

const defaultsuccess : OnSuccess = function
( { suiteName, testName } ) {
  console.log ( `PASS: ${ suiteName } ${ testName }` )
}

const defaultfail : OnFail = function
( f: Failure ) {
  console.log ( `FAIL: ${ f.suiteName } ${ f.testName }` )
  switch ( f.assertion ) {
    case 'notSame':
      console.log ( 'expected', f.actual )
      console.log ( 'to not be', f.expected )
      break;
    case 'same':
      console.log ( 'expected', f.actual )
      console.log ( 'to be', f.expected )
      break;
    case 'equal':
      console.log ( 'expected' )
      console.log ( JSON.stringify ( f.actual, null, 2 ) )
      console.log ( 'to equal' )
      console.log( JSON.stringify ( f.expected, null, 2 ) )
      break;
  }
  return false
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

interface Failure extends Test {
  error: string
  expected: any
  actual: any
  assertion: 'same' | 'notSame' | 'equal'
}

interface RunResult {
  allok: Boolean
  testcount: number
  failcount: number
  failures: Failure[]
}

const makeAssert = function
( f: Failure
): Assert {
  return {
      same ( a, b ) {
        f.assertion = 'same'
        f.actual   = a
        f.expected = b
        if ( a !== b ) {
          throw `${ a } !== ${ b }`
        }
      }
    , notSame ( a, b ) {
        f.assertion = 'notSame'
        f.actual   = a
        f.expected = b
        if ( a === b ) {
          throw `${ a } === ${ b }`
        }
      }
    , equal ( a, b ) {
        f.assertion = 'equal'
        f.actual   = a
        f.expected = b
        if ( !deepEqual ( a, b, { strict: true } ) ) {
          throw `!deepEqual ( ${ a }, ${ b } )`
        }
      }
    }
}

export const run = function
( onsuccess: OnSuccess = defaultsuccess
, onfail: OnFail = defaultfail
, onsuite?: OnSuite
, ontest?: OnTest
) : RunResult {
  let testcount = 0
  let failcount = 0
  let failures: Failure[] = []
  let failure = <Failure> {}
  let assert = makeAssert ( failure )
  for ( const suite of suites ) {
    if ( onsuite ) {
      onsuite ( suite )
    }
    for ( const test of suite.tests ) {
      if ( ontest ) {
        ontest ( test )
      }
      try {
        testcount += 1
        test.test ( assert )
        onsuccess ( test )
      }
      catch ( error ) {
        Object.assign ( failure, { error }, test )
        failures.push ( failure )
        failcount += 1
        if ( ! onfail ( failure ) ) {
          // abort
          return { allok: false, failcount, testcount, failures }
        }
        failure = <Failure> {}
        assert = makeAssert ( failure )
      }
    }
  }
  return { allok: failcount == 0, testcount, failcount, failures }
}
