import * as deepEqual from 'deep-equal'

interface Assert {
  same<T> ( a: T, b: T ): void
  notSame<T> ( a: T, b: T): void
  equal<T> ( a: T, b: T ): void
  pending ( msg: string ): void
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

const defaultSuccess : OnSuccess = function
( { suiteName, testName } ) {
  // console.log ( `PASS: ${ suiteName } ${ testName }` )
}

const defaultPending: OnFail = function
( { suiteName, testName, actual } ) {
  console.log ( `PEND: ${ suiteName } ${ testName }` )
  console.log ( actual )
  return true
}

const defaultFail : OnFail = function
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

interface Failure extends Test {
  error: string
  expected: any
  actual: any
  assertion: 'same' | 'notSame' | 'equal' | 'pending'
}

interface RunResult extends TestStats {
  allok: Boolean
  failures: Failure[]
}

interface TestStats {
  testCount: number
  passCount: number
  failCount: number
  pendingCount: number
  assertCount: number
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
          throw `${ a } !== ${ b }`
        }
      }
    , notSame ( a, b ) {
        stats.assertCount += 1
        f.assertion = 'notSame'
        f.actual   = a
        f.expected = b
        if ( a === b ) {
          throw `${ a } === ${ b }`
        }
      }
    , equal ( a, b ) {
        stats.assertCount += 1
        f.assertion = 'equal'
        f.actual   = a
        f.expected = b
        if ( !deepEqual ( a, b, { strict: true } ) ) {
          throw `!deepEqual ( ${ a }, ${ b } )`
        }
      }
    , pending ( m ) {
        f.assertion = 'pending'
        f.actual = m
        throw m
      }
    }
}

export const run = function
( onsuccess: OnSuccess = defaultSuccess
, onfail: OnFail = defaultFail
, onpending: OnFail = defaultPending
, onsuite?: OnSuite
, ontest?: OnTest
) : RunResult {
  const stats =
  { testCount: 0, failCount: 0, passCount:0, pendingCount: 0
  , assertCount: 0
  }
  let failures: Failure[] = []
  let failure = <Failure> {}
  let assert = makeAssert ( failure, stats )
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
        test.test ( assert )
        // PASS
        stats.passCount += 1
        onsuccess ( test )
      }
      catch ( error ) {
        // FAIL
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
            return Object.assign ( { failures, allok: stats.passCount == stats.testCount }, stats )
          }
        }
        failure = <Failure> {}
        assert = makeAssert ( failure, stats )
      }
    }
  }
  return Object.assign ( { failures, allok: stats.passCount == stats.testCount }, stats )
}
