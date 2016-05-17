import './style.scss'
import { Component } from 'cerebral-view-snabbdom'
import { Flex } from './Flex'

export const TestView =
Component
( {
  }
, ( { state, signals } ) => (
    <Flex column alignChildren="center">
      <Flex>I am vertically centered</Flex>
      <Flex alignSelf="center">So am I, but also horizontally centered</Flex>
    </Flex>
  )
)
