import { connect, JSX } from '../Component'

import './style.scss'
declare var require: any
const VERSION: string = require ( 'raw-loader!../../../app/build/VERSION' )
/*
export default connect
( {}
, 
      */
export default
function App () {
    return (
       <div className='App'>
        <section className='hero is-primary'>
          <div className='hero-head'>
            <div className='container'>
              <nav className='nav'>
                <div className='nav-left'>
                  <a className='nav-item is-brand'>
                    <h1 className='title'>Lucidity</h1>
                  </a>
                </div>
              </nav>
            </div>
          </div>
          <div className='hero-body'>
            <div className='container'>
            </div>
          </div>
          <div className='container'>
            <div className='hero-footer'>
            </div>
          </div>
        </section>
        <section className='Main section'>
          <div className='columns'>
            <div className='Code column'>Code</div>
            <div className='Visuals column'>Visuals</div>
          </div>
        </section>
        <footer className='footer'>
          <div className='container'>
            <div className='content has-text-centered'>
              <p>
                <strong>Lucidity</strong> <small>- version: { VERSION }</small>
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }
      /*
)
*/