import { Document } from 'blocks/document'

export interface DataState {
  Class: {
    [ key: string ]: {
      id: string
      title: string
    }
  }
  Document: {
    [ key: string ]: Document
  }
  Folder: {
    [ key: string ]: {
      id: string
      title: string
    }
  }
  Student: {
    [ key: string ]: {
      id: string
      title: string
    }
  }
}

export const data = {
  state:
  { Student:
    { s1:
      { meta: { id: 's1' }
      , title: 'Emma Litchi'
      }
    , s2: 
      { meta: { id: 's2' }
      , title: 'José Longan'
      }
    }
  , Class:
    { c1:
      { meta: { id: 'c1' }
      , title: 'moyen 1 Sion'
      }
    , c2: 
      { meta: { id: 'c2' }
      , title: 'moyen 2 Conthey'
      }
    }
  , Document: {}
  , Folder:
    { f1:
      { meta: { id: 'f1' }
      , title: 'Harmonie I'
      }
    , f2:
      { meta: { id: 'f2' }
      , title: 'Harmonie II'
      }
    , f3: 
      { meta: { id: 'f3' }
      , title: 'Rhythmique'
      }
    }
  }
}
