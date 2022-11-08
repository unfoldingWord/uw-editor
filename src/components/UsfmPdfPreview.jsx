import React from 'react'
import PropTypes from 'prop-types';
import PkPdfPreview from "./PkPdfPreview";
import usePkImport from "../hooks/usePkImport";

export default function UsfmPdfPreview( props) {
  const { docSetId, usfmText, bookId } = props;
  const docSetBookId = `${docSetId}/${bookId}`

  const { loading, done } = usePkImport( docSetBookId, usfmText ) 

  return (
    <div>
      {loading && (<div>Loading...</div>)}
      {done && <PkPdfPreview { ...props } />}
    </div>
  )
};

UsfmPdfPreview.propTypes = {
  onSave: PropTypes.func,
  docSetId: PropTypes.string,
  usfmText: PropTypes.string,
  bookId: PropTypes.string, 
};
