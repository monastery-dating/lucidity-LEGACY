module Lucidity where

import Library
import Project
import Workbench

import Html exposing (..)

-- MODEL

type alias Model = 
  { library : Library.Model
  , workbench : Workbench.Model
  , project : Project.Model
  }

init : {} -> Model
init graph =
  { library = Library.init graph
  , workbench = Workbench.init graph
  , project = Project.init graph
  }

-- UPDATE

type Action
  = Reset
  | Lib Library.Action
  | Work Workbench.Action
  | Proj Project.Action

-- Do nothing for the moment
update : Action -> Model -> Model
update action model =
  case action of
    Reset ->
      model

    Lib act ->
      model

    Work act ->
      model -- { model | topCounter = Counter.update act model.topCounter }

    Proj act ->
      model

-- VIEW

view : Signal.Address Action -> Model -> Html
view address model =
  div []
    [ Library.view (Signal.forwardTo address Lib) model.library
    , Workbench.view (Signal.forwardTo address Work) model.workbench
    , Project.view (Signal.forwardTo address Proj) model.project
    ]

