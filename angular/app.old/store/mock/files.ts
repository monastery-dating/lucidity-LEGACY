import { GraphType } from '../../common/graph.type'
export const mockFiles : GraphType = {
  "type": "files",
  "boxes": {
    "id0": {
      "name": "Gods of India",
      "type": "Project",
      "in": [],
      "out": null,
      "next": "id1"
    },
    "id1": {
      "name": "ai",
      "type": "Folder",
      "in": [],
      "out": null,
      "sub": "id2",
      "next": "id4"
    },
    "id2": {
      "name": "ai.Play",
      "type": "Block",
      "in": [],
      "out": null,
      "next": "id3"
    },
    "id3": {
      "name": "ai.Learn",
      "type": "Block",
      "in": [],
      "out": null
    },
    "id4": {
      "name": "foo.Bar",
      "type": "Block",
      "in": [],
      "out": null
    }
  }
}
