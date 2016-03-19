module Project where

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
  div [ id "project" ]
    [ h3 [ class "sel" ] [ text "Gods of India" ]
    , div [ class "control" ]
      [ p [] [ text "Control" ]
      , ol []
        [ li [] [ text "OSC" ]
        , li [] [ text "MIDI" ]
        , li [] [ text "VST Plugin" ]
        , li [] [ text "Keyboard" ]
        , li [] [ text "Mouse" ]
        ]
      ]
    , div [ class "scenes" ]
      [ p [] [ text "Scenes" ]
      , ol []
        [ li [] [ text "intro" ]
        , li [ class "sel" ] [ text "cubes" ]
        , li [] [ text "terrain" ]
        ]
      ]
    , div [ class "assets" ]
      [ p [] [ text "Assets" ]
      , ol []
        [ li [] [ text "dancing queen.mp4" ]
        , li [] [ text "shiva.jpg" ]
        , li [] [ text "lucy-forge (lib)" ]
        , li [] [ text "lucy-b2 (lib)" ]
        ]
      ]
    ]

