import StartApp.Simple exposing (start)
import Lucidity exposing (init, update, view)

main =
  start
    { model = init
    , update = update
    , view = view
    }

