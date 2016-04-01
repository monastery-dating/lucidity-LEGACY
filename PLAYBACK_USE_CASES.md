Use cases that the playback engine should be able to implement:

# Effect on rendered image

A parent applies an effect on the image produced by a child.

Requires that either:
  
  A. The child renders to a target provided in the context
  B. The parent has access to the render target of the child

Solution (A) is better since it makes rendering to screen or offline simple by
passing a default render target in the context.

# Rendering the geometry

A parent renders the geometry provided by a child.

Requires that either:

  A. The child changes the geometry of an object in the context
  B. The parent has access to some data in the child.

Again, solution (A) seems better.

# Geometry altering

A parent alters the geometry of a child.

Since we are altering an element provided by another node, we should use
Immutable.js to check for changes and not alter in place. Something like this
could work:

  // 'update' is called parent to children
  // 'render' is called child to parent
  grandparent.update ( self, ctx ) {
  }

  grandparent.render ( self, ctx, child ) {
    if ( child.geometry ) {
      // check if it changed, set to object, etc
      self.object3D.geometry = child.geometry
    }
    // render to current target
    renderImage ( self.object3D, ctx.target )
  }

  // geometry modifier
  parent.update ( self, ctx ) {
    // nothing to pass to children
  }

  parent.render ( self, ctx, child ) {
    // alter geometry
    return ctx.set ( 'geometry', transform ( child.geometry ) )
  }

  child.update ( self, ctx ) {
  }

  // This child has no sub-nodes
  child.render ( self, ctx ) {
    updateGeom ( self )
    return ctx.set ( 'geometry', self.geometry )
  }

From what we see, the 'update' function does not need to be called on each
frame. But it might be save to keep it instead of caching changes to the context
outside of the object.

# Mixing two images

The parent should provide two different render targets, one for each child...

  // Could this work ?
  parent.update ( self, ctx ) {
    return [ { target: ltarget }
           , { target: rtarget }
           ]
    // But then how to get back to the images ?
    // Ah yes, written in ltarget and rtarget.
  }
    
# Receiving multiple mesh from different children

What happens if we have many children and they want to add geometry to the scene
graph ? Should we compose horizontally ? Or vertically ?

  // This is what seems easier in the child
  child1.render ( self, ctx ) {
    // This will be passed as argument to parent 'render' function
    return { mesh: self.mesh }
  }
  
  // Now the parent could have
  parent.render ( self, ctx, child1, child2 ) {
    // one 'child' context per outlet
  }

# Scene graph visual composition

We want to compose (part of) scene graphe dependency graphically.

  child.update ( self, ctx ) {
  }

  getLeg( self, legid, ctx ) {
    if ( self[ legid ] != ctx.mesh ) {
      self.mesh.remove ( self[ legid ] )
      self[ legid ] = ctx.mesh
      self.mesh.add ( ctx.mesh )
    }
  }

  // the child has two outlet
  child.render ( self, ctx, lchild, rchild ) {
    getLeg ( self, 'lleg', lchild )
    getLeg ( self, 'rleg', rchild )
    // render
  }

  // the child has no outlet
  child.render ( self, ctx ) {
    getMesh ( self, ctx.mesh )
    // render
  }
