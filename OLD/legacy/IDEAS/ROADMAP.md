## LUCIDITY 1.0

- No Pouchdb/Couchdb sync: simple app model with FS load
- Open app ==> ask for project name+folder OR open existing (no recents for the
  moment)
- Upgrade to Cerebral 2.0 + Inferno
- Where to store app settings ? (recent projects, library location)
- Create first song (build objects, fix bugs as we go)

## DAW integration

Doing this is a huge motivator to work on real stuff.

**What is the simplest, minimal thing that could work ?**

1. Use midi for communication if this works on Windows.
2. Store project in fs next to song (easy to open along with song).
3. No beat sync: only use events.
4. Use bitwig JS API to send information on some clip events ?

## HOW it could work

1. DAW sends events (midi notes at first)
2. Use some conventions on track/scene/clip names to control lucidity ?
3. Two ways to change values:
  1. Direct change (good if value can jump). Values could have easing settings from simple ease-in-out to physical spring simulations.
     ==> **we need a simple concept of "controllable value"** vs **tweakable value**...
  2. Envelope trigger (ADSR at first, then something like Zebra's MSEG)
  3. Lucidity timing should allow modifiers for shuffle.
  4. Visual "groove" (laid back/rushing) is done in DAW by moving notes or track latency/delay/etc.


Could make a small plugin that talks to Lucidity to:

  - Load the project on audio activation.
  - Be inserted on a track to send automation values to lucidity (could produce jitter, maybe not such a great idea ?)
  - How can we store ideas for visuals along with some sound snippets/scenes ? (bitwig focus). Saving a patch as JSON inside the project would be trivial.
