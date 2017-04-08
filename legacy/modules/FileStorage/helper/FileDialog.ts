interface PathCallback {
  ( path: string ): void
}

let pathSelected: PathCallback

const filechooser = document.createElement ( 'input' )
filechooser.setAttribute ( 'type', 'file' )
filechooser.setAttribute ( 'nwdirectory', 'nwdirectory' )
filechooser.classList.add ( 'filedialog' )
filechooser.style.visibility = 'hidden'
document.body.appendChild ( filechooser )

filechooser.addEventListener ( 'change', ( event ) => {
  pathSelected ( filechooser.value )
  // filechooser.value = ''
})

export const getDirectory =
( message: string
, callback: PathCallback
) => {
  if ( confirm ( message ) ) {
    pathSelected = callback
    filechooser.click ()
  }
  else {
    callback ( null )
  }
}
