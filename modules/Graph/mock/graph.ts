import { GraphWithBlocksType } from '../types'
export const mockGraph : GraphWithBlocksType = {
  // "type": "render",
  "blocksById": {
    "id0": {
      "_id": "id0",
      "type": "block",
      "name": "main",
      "source": "",
      "init": false,
      "output": null,
      "input": [
        "any"
      ]
    },
    "id1": {
      "_id": "id1",
      "type": "block",
      "name": "3D.Cube",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": []
    },
    "some-big-id2": {
      "_id": "some-big-id2",
      "type": "block",
      "name": "3D.TimeShader",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": []
    },
    "id3": {
      "_id": "id3",
      "type": "block",
      "name": "3D.Scene",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": [
        "text:string",
        "text:string"
      ]
    },
    "id4": {
      "_id": "id4",
      "type": "block",
      "name": "filter.Anaglyph",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": [
        "text:string"
      ]
    },
    "id5": {
      "_id": "id5",
      "type": "block",
      "name": "filter.Glow",
      "source": "",
      "init": true,
      "output": "text:string",
      "input": [
        "text:string",
        "text:string"
      ]
    }
  },

  "nodesById": {
    "id0": {
      "id": "id0",
      "blockId": "id0",
      "parent": null,
      "children": [
        "id5"
      ]
    },
    "id1": {
      "id": "id1",
      "blockId": "id1",
      "children": [],
    },
    "id2": {
      "id": "id2",
      "blockId": "some-big-id2",
      "children": [],
    },
    "id3": {
      "id": "id3",
      "blockId": "id3",
      "children": [
        null,
        "id2"
      ]
    },
    "id4": {
      "id": "id4",
      "blockId": "id4",
      "children": [
        "id3"
      ]
    },
    "id5": {
      "id": "id5",
      "blockId": "id5",
      "children": [
        "id4",
        null
      ]
    }
  },

  "nodes": [
    "id0",
    "id2",
    "id3",
    "id4",
    "id5"
  ]
}
