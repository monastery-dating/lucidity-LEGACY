import { GraphType, ComponentByIdType } from '../../Graph'
import { exportDoc } from '../../Graph/helper/GraphParser'
import * as JSZip from 'jszip'


/*
var zip = new JSZip ()
zip.file("Hello.txt", "Hello World\n");
var img = zip.folder("images");
img.file("smile.gif", imgData, {base64: true});
zip.generateAsync({type:"blob"})
.then(function(content) {
    // see FileSaver.js
    saveAs(content, "example.zip");
});
*/
const zipfile =
( zip, name, source, blockId ) => {
  zip.file ( name, source )
}

const zipfolder =
( zip, name ) => {
  return zip.folder ( name )
}

interface DoneCallback {
  ( zip: string ): void
}

export module LibraryHelper {
  export const zip =
  ( components: ComponentByIdType
  , doneClbk?: DoneCallback
  ) => {
    const jszip = new JSZip ()
    for ( const k in components ) {
      const comp = components [ k ]
      exportDoc
      ( comp, jszip, zipfile, zipfolder )
    }

    const p = jszip.generateAsync
    ( { compression: 'DEFLATE', type: 'base64' } )

    if ( doneClbk ) {
      p.then ( doneClbk )
    }
    else {
      return p
    }
  }
}
