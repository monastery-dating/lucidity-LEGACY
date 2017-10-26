import { Signal, State } from 'app'
import * as React from 'react'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import * as katex from 'katex'

import './style.scss'
import { LatexEdit } from './LatexEdit'

interface Props {
  code: typeof State.latex.code
}

interface EProps {
  path: string
}

const Wrapper = styled.div`
background: #f5f5f5;
border-left: 3px solid #ccc;
margin: 2rem;
padding: 1rem;
`

export const LatexDisplay = connect < Props, EProps > (
  { code: state`${ props`path` }.code`
  }
, class LatexDisplay extends React.Component < Props & EProps > {

    create ( el : any  ) {
      if ( !el ) { return }
      const code = this.props.code
      katex.render ( code, el )
    }

    render () {
      const { props } = this
      return (
        <Wrapper>
          <div ref={ el => this.create ( el ) }></div>
        </Wrapper>
      )
    }
  }
)

interface LProps {
  edit: typeof State.latex.$edit
  toggleEdit: typeof Signal.latex.toggleEdit
}

interface LEProps {
  path: string
}

export const Latex = connect < LProps, LEProps > (
  { edit: state`${ props`path` }.$edit`
  , toggleEdit: signal`latex.toggleEdit`
  }
, function Latex ( { edit, path, toggleEdit } ) {
    const onClick = () => {
      console.log ( 'CLICK' )
      toggleEdit ( { path } )
    }
    return (
      <div onClick={ onClick } >
        <LatexDisplay path={ path } />
        { edit
          ? <LatexEdit path={ path } />
          : null
        }
      </div>
    )
  }
)
