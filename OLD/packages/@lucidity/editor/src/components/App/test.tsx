import { JSX } from '../Component'
import { render } from '../TestHelper'
import App from './'

it ( 'renders without crashing', () => {
  render ( <App /> )
})
