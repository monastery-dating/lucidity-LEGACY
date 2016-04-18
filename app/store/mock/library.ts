import { GraphType } from '../../common/graph.type'
export const mockLibrary : GraphType = {
  "type": "library",
  "boxes": {
    "id0": { // Do we need this root element ?
      "name": "Library",
      "type": "Library",
      "in": [],
      "out": null,
      "next": "id1"
    },
    "id1": {
      "name": "generator",
      "type": "Folder",
      "in": [],
      "out": null,
      "sub": "id2",
      "next": "id4"
    },
    "id2": {
      "name": "Crystal",
      "type": "Block",
      "in": [],
      "out": null,
      "next": "id3"
    },
    "id3": {
      "name": "Video",
      "type": "Block",
      "in": [],
      "out": null
    },
    "id4": {
      "name": "filter",
      "type": "Folder",
      "in": [],
      "out": null
    }
  }
}
