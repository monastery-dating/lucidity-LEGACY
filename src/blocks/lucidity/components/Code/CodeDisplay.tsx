import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'

interface Props {
}

interface EProps {
  path: string
}

export const CodeDisplay = connect < Props, EProps > (
  { 
  }
, function CodeDisplay ( {  } ) {
    return (
      <div>THIS IS CODE</div>
    )    
  }
)