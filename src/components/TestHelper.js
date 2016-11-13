import React from 'react'
import {StateContainer} from 'cerebral/react'
import {mount} from 'enzyme'
export {mountToJson as snapshot} from 'enzyme-to-json'

export function render (block, state) {
  const wrapper = mount(
   <StateContainer state={state}>
      <div id='testhelper'>
       {block}
     </div>
   </StateContainer>
 )
  return wrapper.find('#testhelper').children()
}
