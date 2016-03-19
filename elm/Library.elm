module Library where

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
  div [ id "library" ]
    [ h3 [] [ text "Library" ]
    , div [ class "search" ]
      [ p []
        [ text "&nbsp;" 
        , input [ value "search" ] []
        ]
      , ol [ class "saved" ]
        [ li [ class "sel" ] [ text "f" ]
        , li [] [ text "m" ]
        , li [] [ text "g" ]
        , li [] [ text "b" ]
        , li [] [ text "x" ]
        , li [ class "add" ] [ text "+" ]
        ]
      ]
    , ol [ class "results" ]
      [ li [ class "box6" ] [ text "filter.Blur" ]
      , li [ class "box6" ] [ text "filter.Bloom" ]
      , li [ class "box6" ] [ text "filter.Curves" ]
      , li [ class "box3" ] [ text "generator.Crackle" ]
      , li [ class "box2" ] [ text "misc.Color" ]
      ]
    , div [ class "console" ]
      [ p []
        [ text "Console"
        , input [ value "search" ] []
        ]
      , ol []
        [ li [ class "ok" ] [ text "Generated 34 cubes" ]
        ]
      ]
    ]
      
