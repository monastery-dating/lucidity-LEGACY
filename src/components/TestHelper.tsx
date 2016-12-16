import { JSX } from './Component'
import { StateContainer } from 'cerebral/react'
import { mount } from 'enzyme'
export { mountToJson as snapshot } from 'enzyme-to-json'

export function render ( block: any, state?: any ) {
  const wrapper = mount
  ( <StateContainer state={ state }>
      <div id='testhelper'>
       { block }
     </div>
   </StateContainer>
 )
  return wrapper.find ( '#testhelper' ).children ()
}
