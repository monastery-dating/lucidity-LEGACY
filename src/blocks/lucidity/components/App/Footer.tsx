import { connect, JSX } from 'builder'
import { signal } from 'cerebral/tags'

const VERSION = process.env.VERSION as string

interface Props {
  bugClick: () => void
}

export const Footer = connect < Props > (
  { bugClick: signal`composer.bugClicked`
  }
, function Footer ( { bugClick } ) {
    return (
      <footer className='footer'>
        <div className='container'>
          <div className='content has-text-centered'>
            <p>
              <strong>Sarigama</strong> <small>- version: { VERSION }</small>
            </p>
            
            <p className='control'>
              <a className='button'
                onClick={ () => bugClick () }>
                <span className='icon is-small'>
                  <i className='fa fa-bug' />
                </span>
              </a>
            </p>
          </div>
        </div>
      </footer>
    )
  }
)
