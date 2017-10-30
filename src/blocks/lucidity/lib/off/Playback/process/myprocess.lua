local process = require 'lucidity'

local send = process.send

function process.receive ( op, data )
  if op === 'data' then
    send ( 'data', data + 1 )
  else if op === 'foobar' then
    --
  end
end

process.listen ()
