import { State } from 'app'
import { JSX, connect } from 'builder'
import { state, signal } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'
import { styled, Col } from 'styled'
import { Button, Buttons } from 'styled/Button'
import { Card, Content, Footer, Title } from 'styled/Card'
import { Icon } from 'styled/Icon'

import { NavContent } from './NavContent'
import { Tab, Tabs } from './Tab'

interface Props {
  navigator: typeof State.navigation.navigator
  navigatorType: typeof State.navigation.navigatorType
}

interface Eprops {
}

const Arrow = styled.div`
&:before {
  position: absolute;
  right: 16px;
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  content: "";
  /* arrow up */
  top: -9px;
  border-bottom-color: ${ p => p.theme.primaryColor };
  border-width: 0 9px 9px;
  margin-left: -9px;
}
`

const TheCard = Card.extend`
position: absolute;
top: 9px;
right: -6px;
z-index: 99;
`

const Wrapper = styled.div`
position: relative;
`

export const Navigator = connect < Props, Eprops > (
  { navigator: state`navigation.navigator`
  , navigatorType: state`navigation.navigatorType`
  }
, function Navigator ( { navigator, navigatorType } ) {
    return (
      <Wrapper>
        <TheCard>
          <Title name='Navigator'>
            <Arrow />
          </Title>
          <Content>
            <Tabs>
              <Tab type='Document' />
              <Tab type='Student' />
              <Tab type='Class' />
              <Tab type='Folder' />
            </Tabs>
            <NavContent type={ navigatorType } />
            <Col xs={true}>
              <Buttons>
                <Button primary name='New' onClick='document.newDocument' />
              </Buttons>
            </Col>
          </Content>
          <Buttons>
          </Buttons>
          <Footer />
        </TheCard>
      </Wrapper>
    )
  }
)
