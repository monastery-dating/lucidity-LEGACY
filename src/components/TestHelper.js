import React from 'react'
import {StateContainer} from 'cerebral/react'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'

export function snapshot (block, state) {
  const wrapper = mount(
   <StateContainer state={state}>
      <div id='testhelper'>
       {block}
     </div>
   </StateContainer>
 )

  return mountToJson(wrapper.find('#testhelper').children())
}
