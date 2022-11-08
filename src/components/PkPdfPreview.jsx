import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from "use-deep-compare";
import PdfPreview from "./PdfPreview";
import { LocalPkCacheContext } from '../context/LocalPkCacheContext'

export default function PkPdfPreview( props) {
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

  const pdfPreviewProps = {
    ...props,
    bookId,
    epiteleteHtml,
  };

  return (<PdfPreview { ...pdfPreviewProps } />)
};

PkPdfPreview.propTypes = {
  onSave: PropTypes.func,
  docSetId: PropTypes.string,
  bookId: PropTypes.string, 
};
