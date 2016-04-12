export const mockGraph = {
  "id0": {
    "name": "cubes",
    "type": "lucy.Scene",
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
    "out": "text:string",
    "in": []
  },
  "id2": {
    "name": "Lucy",
    "out": "text:string",
    "in": []
  },
  "id3": {
    "name": "Mix",
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
