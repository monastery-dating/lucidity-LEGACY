local json = require 'rapidjson'
local lib = {}

-- Global
lucidity = lib

function lib.send ( ... )
  local msg = json.encode ( { ... } )
  io.stdout:write ( msg .. '\n' )
  io.stdout:flush ()
end

-- This should be overwriten by scripts using this module.
function lib.receive ( data )
end

-- This is called during the boot process
function lib.boot ()
  local line = io.read ( '*line' )
  local msg = json.decode ( line )
  local op = msg [ 1 ]
  local src = msg [ 2 ]
  assert ( op == 'source', 'Invalid message "' .. op .. '"')
end

function lib.setSource ( source )
  io.stderr:write ( 'SET SOURCE\n' )
  local func, err = loadstring ( source, 'main.lua' )
  if not func then
    io.stderr:write ( err .. '\n' )
  else
    local ret, err = pcall ( func )
    if ret then
      lib.send ( 'ready' )
    else
      io.stderr:write ( err .. '\n' )
    end
  end
end

function lib.listen ()
  lib.send ( 'ready' )
  while ( true ) do
    local line = io.read ( '*line' )
    if line then
      local msg = json.decode ( line )
      local op = msg [ 1 ]
      local data = msg [ 2 ]
      if op == 'source' then
        lib.setSource ( data )
      else
        lib.receive ( unpack ( msg ) )
      end
    end
  end
end

lib.listen ()
