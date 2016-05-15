import { Component as CComp, render as Crender } from 'cerebral-view-snabbdom'

const SVGNS = 'http://www.w3.org/2000/svg'
const modulesNS = [ 'hook', 'on', 'style', 'class', 'props', 'attrs' ]
const slice = Array.prototype.slice

interface SubComponent {
  ( props: any, children: VNode[] )
}

interface VPrimitiveNode {
  text: any
}

interface VTagNode {
  sel: string
  key: string
  data: any
  children?: VNode[]
}

type VNode = VPrimitiveNode | VTagNode

const mapData = function
( adata: any
, noprops?: Boolean
): any {
  const data: any = { }
  const props = noprops ? data : {}
  let hasProps = false
  for ( const k in adata ) {
    if ( k === 'key' ) {
      // set outside of data
      continue
    }

    else if ( k === 'class' ) {
      const aclass = adata [ k ]
      let klass = data.class
      if ( !klass ) {
        klass = {}
        data.class = klass
      }
      if ( typeof aclass === 'string' ) {
        const klasses = aclass.split ( /\s+/ )
        for ( const k of klasses ) {
          klass [ k ] = true
        }
      }
      else {
        Object.assign ( klass, aclass )
      }
    }

    else {
      const dash = k.indexOf ( '-' )
      if ( dash > 0 ) {
        const nkey = k.split ( '-' )
        const fkey = nkey.pop ()
        let base : any = data
        for ( const l of nkey ) {
          if ( ! base [ l ] ) {
            base = base [ l ] = {}
          }
          else {
            base = base [ l ]
          }
        }
        base [ fkey ] = adata [ k ]
      }
      else {
        if ( modulesNS.indexOf ( k ) >= 0 ) {
          if ( data [ k ] ) {
            Object.assign ( data [ k ], adata [ k ] )
          }
          else {
            data [ k ] = adata [ k ]
          }
        }
        else {
          hasProps = true
          props [ k ] = adata [ k ]
        }
      }

    }
  }
  if ( !noprops && hasProps ) {
    data.props = props
  }
  return data
}

const mapChildren = ( c ) => {
  if ( typeof c === 'object' ) {
    return c
  }
  else {
    return { text: c }
  }
}

const remapSVGData = ( adata ) => {
  // This is probably buggy
  adata.attrs = Object.assign ( adata.props.attrs || {}, adata.props )
  delete adata.props
  delete adata.attrs.attrs

  adata.ns = SVGNS
  return adata
}

const setSVGChildren = ( children ) => {
  for ( const c of children ) {
    if ( c.data ) {
      c.data = remapSVGData ( c.data )
      if ( c.children ) {
        setSVGChildren ( c.children )
      }
    }
  }
}

const createElement = function
( sel: string | SubComponent
, adata: any
, achildren: any[]
) : VNode {

  let children = achildren
  if ( !Array.isArray ( achildren ) ) {
    children = slice.call ( arguments, 2 )
  }
  else if ( arguments.length > 3 ) {
    children = [ ...children ]
    for ( const c of slice.call ( arguments, 3 ) ) {
      if ( Array.isArray ( c ) ) {
        children = [ ...children, ...c ]
      }
      else {
        children.push ( c )
      }
    }
  }

  if ( children ) {
    children = children.map
    ( ( c ) => typeof c === 'object' ? c : { text: c } )
  }

  if ( typeof sel === 'string' ) {
    const vnode: any = { sel }
    if ( adata ) {
      if ( adata.key ) {
        vnode.key = adata.key
      }

      const data = mapData ( adata )
      vnode.data = data
    }
    else {
      vnode.data = {}
    }

    if ( children ) {
      vnode.children = children
    }

    if ( sel === 'svg' ) {
      setSVGChildren ( [ vnode ] )
    }
    return vnode
  }
  else {
    return sel ( mapData ( adata, true ), children )
  }
}

// HACK. Should be able to change this without or should
// rewrite cerebral-view-snabbdom entirely.
CComp['createElement'] = createElement // CComp.DOM

export const Component = CComp
export const render = Crender
