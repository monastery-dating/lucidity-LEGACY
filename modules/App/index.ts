import { mounted } from './signals/mounted'
import { homeUrl } from './signals/homeUrl'
import { projectUrl } from './signals/projectUrl'
import { projectsUrl } from './signals/projectsUrl'
import { userUrl } from './signals/userUrl'

interface AppSignalsType {
  homeUrl ()
}

export const App =
(options = {}) => {
  return (module, controller) => {
    // no state added

    module.addSignals
    ( { mounted
      , homeUrl
      , projectUrl
      , projectsUrl
      , userUrl
      }
    )

    return {} // meta information
  }
}
