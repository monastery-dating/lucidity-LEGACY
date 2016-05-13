import './style.scss'
import { Component } from '../Component'

const focus = ( _, { elm } ) => {
  setTimeout ( () => {
      elm.focus ()
      elm.select ()
    }
  , 0
  )
}

const makeKeyup = function
( { on, text } ) {
  return ( e ) => {
    if ( e.keyCode === 27 ) {
      // ESC = abort
      e.preventDefault ()
      e.target.setAttribute ( 'data-done', true )
      on.change ( text )
    }
    else if ( e.keyCode === 13 ) {
      // enter = save
      e.preventDefault ()
      e.target.setAttribute ( 'data-done', true )
      on.change ( e.target.value )
    }
  }
}

const makeChange = function ( { on } ) {
  return ( e ) => {
    if ( ! e.target.getAttribute ( 'data-done' ) ) {
      e.target.setAttribute ( 'data-done', true )
      on.change ( e.target.value )
    }
  }
}

export const EditableText = Component
( {}
, ( { props } ) => {
    if ( props.editing ) {
      const klass =
      Object.assign
      ( { EditableText: true, active:  true }
      , props.class || {}
      )
      const keyup = makeKeyup ( props )
      const change = makeChange ( props )
      return <div class={ klass }>
        <input class='fld' value={ props.text }
          hook-create={ focus }
          on-keyup={ keyup }
          on-blur={ change }
          on-change={ change }
          />
        </div>
    }
    else {
      const text = props.saving ? props.stext : props.text
      const klass =
      Object.assign
      ( { EditableText: true, saving: props.saving }
      , props.class || {}
      )
      return <div
          class={ klass }
          on-click={ ( e ) => props.on.edit ( {} ) }>
          { text || props.text }
        </div>
    }
  }
)
