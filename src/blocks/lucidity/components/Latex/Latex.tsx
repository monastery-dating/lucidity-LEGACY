import { Signal, State } from 'app'
import * as React from 'react'
import { connect, JSX } from 'builder'
import { CustomTagProps } from 'editor'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import * as katex from 'katex'

import './style.scss'
import { LatexEdit } from './LatexEdit'

interface Props {
  source: typeof State.latex.source
}

interface EProps {
  path: string
}

const Wrapper = styled.div`
background: #f5f5f5;
border-left: 3px solid #ccc;
margin: 2rem;
min-height: 1.5rem;
padding: 1rem;
`

export const LatexDisplay = connect < Props, EProps > (
  { source: state`${ props`path` }.source`
  }
, class LatexDisplay extends React.Component < Props & EProps > {

    create ( el : any  ) {
      if ( !el ) { return }
      const source = this.props.source
      katex.render ( source, el )
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

export const Latex = connect < LProps, CustomTagProps > (
  { edit: state`${ props`path` }.$edit`
  , toggleEdit: signal`latex.toggleEdit`
  }
, function Latex ( { path, edit, toggleEdit } ) {
    const onClick = () => {
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
