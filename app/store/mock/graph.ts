import { GraphType } from '../../common/graph.type'
export const mockGraph : GraphType = {
  "type": "render",
  "boxes": {
    "id0": {
      "name": "cubes",
      "type": "Scene",
      "link": [
        "id5"
      ],
      "out": null,
      "in": [
        "any"
      ]
    },
    "id1": {
      "name": "Hello",
      "type": "Block",
      "out": "text:string",
      "in": []
    },
    "id2": {
      "name": "Lucy",
      "type": "Block",
      "out": "text:string",
      "in": []
    },
    "id3": {
      "name": "Mix",
      "type": "Block",
      "out": "text:string",
      "in": [
        "text:string",
        "text:string"
      ],
      "link": [
        "id1",
        "id2"
      ]
    },
    "id4": {
      "name": "Stereo",
      "type": "Block",
      "out": "text:string",
      "in": [
        "text:string"
      ],
      "link": [
        "id3"
      ]
    },
    "id5": {
      "name": "Reverse",
      "type": "Block",
      "init": true,
      "out": "text:string",
      "in": [
        "text:string",
        "text:string"
      ],
      "link": [
        "id4",
        null
      ]
    }
  }
}
