module Workbench where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL

type alias Model = {}

init : {} -> Model
init graph = graph

-- UPDATE

type Action = Increment | Decrement

update : Action -> Model -> Model
update action model =
  case action of
    Increment ->
      model

    Decrement ->
      model



-- VIEW

view : Signal.Address Action -> Model -> Html
view address model =
  div [ divStyle ] [ text "WORKBENCH" ]

divStyle : Attribute
divStyle =
  style
    [ ("padding", "20px")
    , ("margin", "20px")
    , ("border", "1px solid #555")
    , ("background", "#ddd")
    , ("display", "table")
    ]
