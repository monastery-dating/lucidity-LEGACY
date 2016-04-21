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
      "out": null,
      "next": "id5"
    },
    "id4": {
      "name": "filter",
      "type": "Folder",
      "in": [],
      "out": null,
      "sub": "id8"
    },
    "id5": {
      "name": "Hello",
      "type": "Block",
      "out": "text:string",
      "in": [],
      "next": "id6"
    },
    "id6": {
      "name": "Lucy",
      "type": "Block",
      "out": "text:string",
      "in": []
    },
    "id7": {
      "name": "Mix",
      "type": "Block",
      "out": "text:string",
      "in": [
        "text:string",
        "text:string"
      ],
      "next": "id9"
    },
    "id8": {
      "name": "Stereo",
      "type": "Block",
      "out": "text:string",
      "in": [
        "text:string"
      ],
      "next": "id7"
    },
    "id9": {
      "name": "Reverse",
      "type": "Block",
      "init": true,
      "out": "text:string",
      "in": [
        "text:string",
        "text:string"
      ]
    }
  }
}
