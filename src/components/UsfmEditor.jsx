import React from 'react'
import PropTypes from 'prop-types';
import PkEditor from "./PkEditor";
import usePkImport from "../hooks/usePkImport";

export default function UsfmEditor( props) {
  const { docSetId, usfmText, bookId } = props;
  const docSetBookId = `${docSetId}/${bookId}`

  const { loading, done } = usePkImport( docSetBookId, usfmText ) 

  return (
    <div>
      {loading && (<div>Loading...</div>)}
      {done && <PkEditor { ...props } />}
    </div>
  )
};

UsfmEditor.propTypes = {
  onSave: PropTypes.func,
  docSetId: PropTypes.string,
  usfmText: PropTypes.string,
  bookId: PropTypes.any, 
};
