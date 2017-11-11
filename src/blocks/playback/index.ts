import { Block } from 'builder'
import { set } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'

export { Playback } from './components/Playback'
export * from './lib/types'

export interface PlaybackState {
  playback: {
    display: 'hide' | 'column' | 'fullscreen'
  }
}

export interface PlaybackSignal {
  playback: {
    setDisplay ( arg: { display: PlaybackState [ 'playback' ] [ 'display' ] } ): void
  }
}

const playbackModule =
{ signals:
  { setDisplay:
    [ set ( state`playback.display`, props`display` )
    ]
  }
, state:
  { display: 'column'
  }
}

export const playback: Block =
{ name: 'playback'
, modules:
  { playback: playbackModule
  }
}
