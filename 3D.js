// This will be the main render
// loop for three.js
console.log ( exports.self )
exports.self = exports.self || { animate () {} }
const self = exports.self

self.animate = () => {
  // child ()
  self.mesh.rotation.x += 0.01
  self.mesh.rotation.y += 0.02
  self.renderer.render ( self.scene, self.camera )
}

export const init =
( ctx ) => {

  if ( self.renderer ) {
    console.log ( 'abort init' )
    return
  }

  const container = document.getElementById ( 'screen' )
  //document.body.appendChild ( container )

  self.renderer = new THREE.WebGLRenderer ()
  // size must be the same as in Playback
  // FIXME: will use ctx.screen.width, ...
  // 320x180


  self.renderer.setSize ( 320, 180 )
  container.appendChild ( self.renderer.domElement )


  self.scene = new THREE.Scene ()

  self.camera = new THREE.PerspectiveCamera ( 75, 16 / 9, 1, 10000 )
  self.camera.position.z = 500

  self.geometry = new THREE.BoxGeometry ( 200, 200, 200 )
  self.material = new THREE.MeshBasicMaterial ( { color: 0xff0000, wireframe: true } )

  self.mesh = new THREE.Mesh ( self.geometry, self.material )
  self.scene.add ( self.mesh )

  animate ()
}


const animate = () => {
  requestAnimationFrame( animate )
  self.animate ()
}

export const render =
( ctx, child, child2 ) => {
  init ()
}
