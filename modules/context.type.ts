import { AppSignalsType } from './App'
import { BlockSignalsType } from './Block'
import { DataSignalsType, DataServicesType } from './Data'
import { DragDropSignalsType } from './DragDrop'
import { FactorySignalsType } from './Factory'
import { FileStorageSignalsType } from './FileStorage'
import { LibrarySignalsType } from './Library'
import { MidiSignalsType } from './Midi'
import { PlaybackSignalsType } from './Playback'
import { ProjectSignalsType } from './Project'
import { SceneSignalsType } from './Scene'
import { StatusSignalsType } from './Status'
import { SyncSignalsType } from './Sync'
import { UserSignalsType } from './User'

interface RouterServicesType {
  // get url from signal name and payload
  getSignalUrl ( signalName: string, payload?: any ): string
  // go to signal
  redirectToSignal ( signalName: string, payload?: any ):void

  // get routable part of current url
  getUrl (): string
  // go to url
  redirect ( url: string, opts?: any ): void
}

export interface SignalsType {
  app: AppSignalsType
  block: BlockSignalsType
  data: DataSignalsType
  $dragdrop: DragDropSignalsType
  $factory: FactorySignalsType
  $filestorage: FileStorageSignalsType
  library: LibrarySignalsType
  midi: MidiSignalsType
  $playback: PlaybackSignalsType
  project: ProjectSignalsType
  scene: SceneSignalsType
  $status: StatusSignalsType
  $sync: SyncSignalsType
  user: UserSignalsType
}

// We make services optional so that we can mock them
// during testing.
interface ServicesType {
  data?: DataServicesType
  router?: RouterServicesType
}

export interface StateType {
  get ( path: string[] )
  get ( path: string )
  set ( path: string[], value: any )
  set ( path: string, value: any )
  unset ( path: string[] )
  unset ( path: string )
}

// We mark fields as optional to ease testing mock.
export interface ActionContextType {
  state?: StateType
  input?: any
  output?: any
  services?: ServicesType
}

export interface ContextType {
  services?: ServicesType
  state: any
  props: any
  signals: SignalsType
  children: any[]
}

// Generic types
export interface SignalAction {
  ( context: ActionContextType ): void
}

interface Path {
  [ key: string ]: SignalType
}

type SignalElement = SignalAction | Path
export type SignalType = SignalElement[]
