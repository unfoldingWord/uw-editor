import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from "use-deep-compare";
import Editor from "./Editor";
import { LocalPkCacheContext } from '../context/LocalPkCacheContext'

export default function PkEditor( props) {
  const { docSetId, bookId } = props;
  const [epiteleteHtml, setEpiteleteHtml] = useState();

  const {
    state: {
      epCache,
    },
  } = useContext(LocalPkCacheContext)

  useDeepCompareEffect(() => {
    if (epCache[docSetId]) {
      setEpiteleteHtml(epCache[docSetId])
    }
  }, [epCache, docSetId]);

  const editorProps = {
    ...props,
    bookId,
    epiteleteHtml,
  };

  return (<Editor { ...editorProps } />)
};

PkEditor.propTypes = {
  onSave: PropTypes.func,
  docSetId: PropTypes.string,
  bookId: PropTypes.string, 
};
