import { GraphType } from '../../common/graph.type'
export const mockProject : GraphType = {
  "type": "project",
  "boxes": {
    "id0": {
      "name": "Gods of India",
      "type": "lucy.Project",
      "in": [],
      "out": null,
      "next": "id1"
    },
    "id1": {
      "name": "ai",
      "in": [],
      "out": null,
      "sub": "id2",
      "next": "id4"
    },
    "id2": {
      "name": "ai.Play",
      "in": [],
      "out": null,
      "next": "id3"
    },
    "id3": {
      "name": "ai.Learn",
      "in": [],
      "out": null
    },
    "id4": {
      "name": "foo.Bar",
      "in": [],
      "out": null
    }
  }
}
