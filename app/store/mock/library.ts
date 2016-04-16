import { GraphType } from '../../common/graph.type'
export const mockLibrary : GraphType = {
  "id0": {
    "name": "Library",
    "type": "lucy.Library",
    "in": [],
    "out": null,
    "next": "id1"
  },
  "id1": {
    "name": "generator",
    "in": [],
    "out": null,
    "sub": "id2",
    "next": "id4"
  },
  "id2": {
    "name": "Crystal",
    "in": [],
    "out": null,
    "next": "id3"
  },
  "id3": {
    "name": "Video",
    "in": [],
    "out": null
  },
  "id4": {
    "name": "filter",
    "in": [],
    "out": null
  }
}
