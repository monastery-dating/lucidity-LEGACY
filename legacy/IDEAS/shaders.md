# Shader names

We need to have some kind of consistency for names so that shaders can be easily
shared/understood.

Shadertoy uses:
  *  vec3      iResolution;           // viewport resolution (in pixels)
  *  float     iGlobalTime;           // shader playback time (in seconds)
  *  float     iChannelTime[4];       // channel playback time (in seconds)
  *  vec3      iChannelResolution[4]; // channel resolution (in pixels)
  *  vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
  *  samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
  *  vec4      iDate;                 // (year, month, day, time in seconds)
  *  float     iSampleRate;           // sound sample rate (i.e., 44100)

I want to have a namespace for Lucidity uniforms. I like the idea of channels in
shadertoy. I do not like this:

  * float      iGlobalTime; // time information in [s]
  * float      iSong; // song position information in [bar % 16]
  * sampler..  iChannel0..3;
  * vec3       iResolution;   // viewport resolution in pixels (why is this a
  *                           // vec3 and not a vec2 ?)

Is this better ? No namespace...

  * float      time; // time information in [s]
  * float      song; // song position information in [bar % 16]
  * sampler..  channel0..3;
  * vec3       resolution;   // viewport resolution in pixels (why is this a
  *                           // vec3 and not a vec2 ?)

Or this (consistent with library namespaces in Lucidity). I like this, users can
change the name inside the shader as they like anyway:

  * float      lucy_time; // time information in [s]
  * float      lucy_song; // song position information in [bar % 16]
  * sampler..  lucy_channel0..3;
  * vec3       lucy_resolution;   // viewport resolution in pixels (why is this a
  *                           // vec3 and not a vec2 ?)

Or use 'fx_' like we get them in context.fx.beat ==> fx_beat. It is short and
simple. [BEST OPTION SO FAR]

  * float      fx_time; // time information in [s]
  * float      fx_song; // song position information in [bar % 16]
  * float      fx_beat;
  * sampler..  fx_channel0..3;
  * vec3       fx_resolution;   // viewport resolution in pixels (why is this a
  *                           // vec3 and not a vec2 ?)

Passing uv coordinates. What to use ?
  * pixel = no: misleading !!
  * vUv   = vertex Uv ? varying uv ? beurk. Why not vuv or even uv ?
  * uv    = good to me.
