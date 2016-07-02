declare var nw: any

export interface MenuDef {
  label?: string
  type?: string
  click?: any
  key?: string
  modifiers?: string

  submenu?: MenuDef[]
}


const nwAddOne =
( menudef: MenuDef
, menu
, pos?: number
) => {
  let m
  if ( menudef.submenu ) {
    let def = Object.assign ( {}, menudef )
    const list = def.submenu
    def.submenu = new nw.Menu ( { type: 'menubar' } )
    m = new nw.MenuItem ( def )
    for ( const sub of list ) {
      nwAddOne ( sub, m.submenu )
    }
  }
  else {
    m = new nw.MenuItem ( menudef )
  }
  if ( pos !== undefined ) {
    menu.insert ( m, pos )
  }
  else {
    menu.append ( m )
  }
}

export const nwMakeMenus =
( menudef: MenuDef[]
) => {
  const menu = new nw.Menu ( { type: 'menubar' } )
  menu.createMacBuiltin ( 'Lucidity', { hideEdit: true } )
  for ( let i = 1; i < menudef.length; ++i ) {
    nwAddOne ( menudef [ i ], menu, i )
  }
  const appdef = menudef [ 0 ].submenu
  const appmenu = menu.items [ 0 ].submenu
  appmenu.remove ( appmenu.items [ 0 ] )
  nwAddOne ( appdef [ 0 ], appmenu, 0 ) // About
  nwAddOne ( appdef [ 1 ], appmenu, 1 ) // Preferences
  nwAddOne ( appdef [ 2 ], appmenu, 2 ) // separator
  nwAddOne ( appdef [ 3 ], appmenu, 3 ) // Preferences
  return menu
}

export const webMakeMenus =
( menudef
) => {
  // TODO for browser...
}
