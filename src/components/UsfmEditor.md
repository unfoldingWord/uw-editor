# UsfmEditor demo

The demo demonstrates using the UsfmEditor in standalone mode
(with all Proskomma / Epitetele handling done through a PkCacheProvider,
 which is included as a wrapper in the app).

```js
import { useState, useEffect } from 'react';
// import { usfmText } from '../data/tit.en.ult.usfm.js';
import { usfmText } from '../data/Acts.1.usfm.js';
import PkCacheProvider from '../context/LocalPkCacheContext'

function Component () {
  const docSetId = 'unfoldingWord/en_ult'
  const bookId = 'ACT'
  const docSetBookId = `${docSetId}/${bookId}`

const onSave = (bookCode,usfmText) => {
    console.log("save button clicked")
    console.log(bookCode)
    console.log(usfmText)
  }

  const onReferenceSelected = (reference) => console.log(reference)

  const editorProps = {
    onSave,
    docSetId,
    usfmText,
    bookId,
    onReferenceSelected,
    activeReference: {
      bookId: 'act',
      chapter: 1,
      verse: "24-25",
    }
  }
  
  return (
      <div key="1">
        <UsfmEditor {...editorProps} />
      </div>
  );
};  

<PkCacheProvider>
  <Component key="1" />
</PkCacheProvider>

```
