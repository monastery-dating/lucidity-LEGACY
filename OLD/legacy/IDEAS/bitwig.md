How to store shader definitions along with sound ?
=====================

* Use "lucy-clip" where we store relative path to effect ?
* Use an option in "lucy-clip" to copy effect files (without big video, images)
  inside the vst on bitwig project save ?

* Each "lucy-clip" has an effect name.

* Then we can then "push" these files on VST load inside the running lucidity
  "plugin/fx/${name}" folder and play them.


* When combining multiple projects together, on adding all "lucy-clip"
  instances, the effects are pushed to "plugin" folder.

* "lucy-note" has a mapping of "note" --> "plugin/fx/foo" (relative to lucidity
  player) These settings are pushed to player on load "plugin/midi_mapping.js"
