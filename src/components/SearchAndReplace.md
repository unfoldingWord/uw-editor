# SearchAndReplace demo

The demo demonstrates using the UsfmEditor in standalone mode 
(with all Proskomma / Epitetele handling done through a PkCacheProvider, 
 which is included as a wrapper in the app).

```js
import { useState, useEffect } from 'react';
import props from '../data/searchAndReplaceData.js';

function Component () {

  const editorProps = {
    target: "good works",
    replacement: "beneficial acts",
    ...props
  }
  
  return (
      <div >
        <SearchAndReplace {...editorProps} />
      </div>
  );
};  

  <Component />

```