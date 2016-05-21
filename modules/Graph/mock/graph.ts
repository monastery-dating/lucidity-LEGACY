import { GraphType } from '../types'
export const mockGraph : GraphType = {
  // "type": "render",
  "nodesById": {
    "id0": {
      "type": "scene",
      "name": "main",
      "path": "/",
      "source": "",
      "init": false,
      "output": null,
      "input": [
        "any"
      ]
    },
    "id1": {
      "type": "block",
      "name": "3D.Cube",
      "path": "/",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": []
    },
    "id2": {
      "type": "block",
      "name": "3D.TimeShader",
      "path": "/",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": []
    },
    "id3": {
      "type": "block",
      "name": "3D.Scene",
      "path": "/",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": [
        "text:string",
        "text:string"
      ]
    },
    "id4": {
      "type": "block",
      "name": "filter.Anaglyph",
      "path": "/",
      "source": "",
      "init": false,
      "output": "text:string",
      "input": [
        "text:string"
      ]
    },
    "id5": {
      "type": "block",
      "name": "filter.Glow",
      "path": "/",
      "source": "",
      "init": true,
      "output": "text:string",
      "input": [
        "text:string",
        "text:string"
      ]
    }
  },

  "linksById": {
    "id0": {
      "id": "id0",
      "parent": null,
      "children": [
        "id5"
      ]
    },
    "id1": {
      "id": "id1",
      "children": [],
    },
    "id2": {
      "id": "id2",
      "children": [],
    },
    "id3": {
      "id": "id3",
      "children": [
        "id1",
        "id2"
      ]
    },
    "id4": {
      "id": "id4",
      "children": [
        "id3"
      ]
    },
    "id5": {
      "id": "id5",
      "children": [
        "id4",
        null
      ]
    }
  },

  "nodes": [
    "id0",
    "id1",
    "id2",
    "id3",
    "id4",
    "id5"
  ]
}
