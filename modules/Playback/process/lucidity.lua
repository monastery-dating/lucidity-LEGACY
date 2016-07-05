local json = require 'rapidjson'
local lib = {}

function lib.send ( ... )
  local msg = json.encode ( { ... } )
  io.stdout:write ( msg .. '\n' )
  io.stdout:flush ()
end

-- This should be overwriten by scripts using this module.
function lib.receive ( data )
end

function lib.listen ()
  lib.send ( 'ready' )
  while ( true ) do
    local line = io.read ( '*line' )
    if line then
      local msg = json.decode ( line )
      local op = msg [ 1 ]
      local data = msg [ 2 ]
      lib.receive ( unpack ( msg ) )
    end
  end
end

-- This is called during the boot process
function lib.boot ()
  local line = io.read ( '*line' )
  local msg = json.decode ( line )
  local op = msg [ 1 ]
  local src = msg [ 2 ]
  assert ( op == 'source', 'Invalid message "' .. op .. '"')
  local func, err = loadstring ( src, 'main.lua' )
  if not func then
    io.stderr:write ( err .. '\n' )
  else
    io.stderr:write ( 'start func \n' )
    local ret, err = pcall ( func )
    if not ret then
      io.stderr:write ( err .. '\n' )
    end
  end
end

return lib
