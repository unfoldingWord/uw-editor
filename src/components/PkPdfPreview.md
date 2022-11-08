# PkPdfPreview demo

The demo demonstrates using the PkPdfPreview in standalone mode 
(with all Proskomma / Epitetele handling done through a PkCacheProvider, 
 which is included as a wrapper in the app).

```js
import { useState, useEffect } from 'react';
import usePkImport from "../hooks/usePkImport";
import { usfmText } from '../data/tit.en.ult.usfm.js';
import PkCacheProvider from '../context/LocalPkCacheContext'

function Component () {
  const docSetId = 'unfoldingWord/en_ult'
  const bookId = 'TIT'
  const docSetBookId = `${docSetId}/${bookId}`

  const { loading, done } = usePkImport( docSetBookId, usfmText ) 

  const onSave = (bookCode,usfmText) => {
    console.log("save button clicked")
    console.log(bookCode)
    console.log(usfmText)
  }

  const pdfPreviewProps = {
    onSave,
    docSetId,
    bookId,
  }
  
  return (
      <div key="1">
        { done ? <PkPdfPreview {...pdfPreviewProps} /> : 'Loading...'}
      </div>
  );
};  

<PkCacheProvider>
  <Component key="1" />
</PkCacheProvider>

```
