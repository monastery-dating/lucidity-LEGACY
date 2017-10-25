import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'
import { Icon } from 'styled/Icon'
import { styled } from 'styled'

export const Tabs = styled.div`
display: flex;
flex-direction: row;
justify-content: space-around;
padding: ${ p => p.theme.blockMargin };
`

interface Props {
  navigatorType: typeof State.navigation.navigatorType
  tabClick: typeof Signal.navigation.tabClicked
  translate: Translate
}

interface EProps {
  type: string
}

export const Tab = connect < Props, EProps > (
  { navigatorType: state`navigation.navigatorType`
  , tabClick: signal`navigation.tabClicked`
  }
, function Tab ( { navigatorType, tabClick, type } ) {
    const selected = type === navigatorType
    return (
      <div>
        <Icon
          icon={ type } 
          onClick={ () => tabClick ( { type } ) }
          selected={ selected } />
      </div>
    )
  }
)
