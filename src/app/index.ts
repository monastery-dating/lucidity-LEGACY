import { boot, BootSignal, BootState } from 'blocks/boot'
import { document, DocumentSignal, DocumentState } from 'blocks/document'
import { editor, EditorSignal, EditorState } from 'blocks/editor'
import { firebase, FirebaseSignal, FirebaseState } from 'blocks/firebase'
import { forms, FormsSignal, FormsState } from 'blocks/forms'
import { watch, WatchSignal, WatchState } from 'blocks/watch'
import { build } from 'builder'

import { app, App, AppSignal, AppState } from 'blocks/lucidity'

export type AllState = 
    AppState
  & BootState
  & DocumentState
  & EditorState
  & FirebaseState
  & FormsState
  & WatchState

export type AllSignal = 
    AppSignal
  & BootSignal
  & DocumentSignal
  & EditorSignal
  & FirebaseSignal
  & FormsSignal
  & WatchSignal

export let State: AllState
export let Signal: AllSignal

build
( App
, app
, boot
, document
, editor
, firebase
, forms
, watch
)