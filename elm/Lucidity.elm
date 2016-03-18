module Lucidity where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL

type alias Model = Int

init : Model
init = 0

-- UPDATE

type Action = Increment | Decrement

update : Action -> Model -> Model
update action model =
  case action of
    Increment ->
      model + 1

    Decrement ->
      model - 1



-- VIEW

view : Signal.Address Action -> Model -> Html
view address model =
  div [ divStyle ]
    [ button [ onClick address Decrement ] [ text "-" ]
    , div [ counterStyle ] [ text (toString model) ]
    , button [ onClick address Increment ] [ text "+" ]
    ]

divStyle : Attribute
divStyle =
  style
    [ ("padding", "20px")
    , ("margin", "20px")
    , ("border", "1px solid #555")
    , ("background", "#ddd")
    , ("display", "table")
    ]

counterStyle : Attribute
counterStyle =
  style
    [ ("font-size", "20px")
    , ("font-family", "monospace")
    , ("display", "inline-block")
    , ("width", "50px")
    , ("text-align", "center")
    ]
