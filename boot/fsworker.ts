import { start } from '../modules/FileStorage/helper/FileStorageMain'
declare var process: any

console.log ( `FSWORKER ${ process.pid } STARTED` )
start ()
console.log ( `FSWORKER ${ process.pid } READY` )
process.on ( 'exit', () => {
  // DOES NOT TRIGGER...?
  console.log ( `FSWORKER ${ process.pid } ENDED\n` )
})

setInterval
( () => {
    console.log ( `FSWORKER ${ process.pid } ALIVE` )
  }
, 30000
)
