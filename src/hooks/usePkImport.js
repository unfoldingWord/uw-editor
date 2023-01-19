import { useContext, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { LocalPkCacheContext } from '../context/LocalPkCacheContext'
import EpiteleteHtml from "epitelete-html";
import findr from "../pipeline"

export default function usePkImport( docSetBookId, usfmText ) {
  const [loading,setLoading] = useState(true)
  const [done,setDone] = useState(false)
  const [org, repoStr, bookId] = docSetBookId?.split('/') ?? []
  const [lang, abbr] = repoStr?.split('_') ?? []
  const docSetId = `${org}/${repoStr}`

  const {
    state: { 
      pkHook, 
      pkCache,
      epCache,
    }, 
    actions: {
      setPkCache,
      setEpCache,
    } 
  } = useContext(LocalPkCacheContext)

  const { proskomma } = pkHook ?? {}; 

  // monitor the pkCache and import when usfmText is available
  useDeepCompareEffect(() => {
    const addpkCache = (key, str) => {
      setPkCache({ [key]: str, ...pkCache });
    }
    async function doImportPk() {
      proskomma.importDocument(
        { org, lang, abbr },
        "usfm",
        usfmText
      )
    }
  
    if (usfmText) {
      if (proskomma && !pkCache[docSetBookId]) {
        doImportPk()
        addpkCache(docSetBookId,bookId)
        setDone(true)
      } else {
        setLoading(false)
      }
    }
  }, [docSetBookId,usfmText,pkCache,proskomma])

  // monitor the epCache and create Epitelete instances as needed
  useDeepCompareEffect(() => {
    const addEpCache = (key, obj) => {
      setEpCache({ [key]: obj, ...epCache });
    }
    
    if (done && proskomma && !epCache[docSetId]) {
      const _ep = new EpiteleteHtml({ 
        proskomma,
        docSetId,
        options: { historySize: 100, ...findr }
      })
      console.log({_ep})
      addEpCache(docSetId,_ep)
    }
  }, [docSetId,epCache,proskomma,done])
  
  return { loading, done }
}
