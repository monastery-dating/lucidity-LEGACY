import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'
import { translate, Translate } from 'config/translate'

const TABS =
[ 'Navigator', 'Score', 'Dictation' ]

interface Props {
  selectedTab: string
  tabClick: ( arg: { tab: string } ) => void
  translate: Translate
}

export const Header = connect < Props > (
  { selectedTab: state`navigation.activity`
  , tabClick: signal`navigation.tabClicked`
  , translate
  }
, function Header ( { selectedTab, tabClick, translate } ) {
    return (
      <section className='hero is-primary'>
        <div className='hero-head'>
          <div className='container'>
            <nav className='nav'>
              <div className='nav-left'>
                <a className='nav-item is-brand'>
                  <h1 className='title'>Sarigama</h1>
                </a>
              </div>
            </nav>
          </div>
        </div>
        <div className='hero-body'>
          <div className='container'>
            <h1 className='title'>Outils de pédagogie musicale</h1>
          </div>
        </div>
        <div className='container'>
          <div className='hero-footer'>
            <div className='tabs is-boxed'
              >
              <ul>
                <li><a>&nbsp;</a></li>
                { TABS.map
                  ( tab => 
                      <li
                        key={ tab } 
                        className={
                          selectedTab === tab
                          ? 'is-active'
                          : ''
                        }
                        onClick={
                          () => tabClick ( { tab: tab } )
                        }
                        >
                        <a>
                          <span className='icon is-small'>
                            <i className={ translate ( tab, 'Icon' ) } />
                          </span>
                          <span>{ translate ( tab, 'Tab' ) }</span>
                        </a>
                      </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }
)
