import React from 'react'
import PropTypes from 'prop-types';
import PkEditor from "./PkEditor";
import usePkImport from "../hooks/usePkImport";

export default function UsfmEditor( props) {
  const { 
    docSetId, 
    usfmText, 
    bookId,
  } = props;

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
  /** Method to call when save button is pressed */
  onSave: PropTypes.func,
  /** Callback triggered when a verse is clicked on */
  onReferenceSelected: PropTypes.func,
  /** docSetId identifies a set of documents in proskomma, usually contains org and language code */
  docSetId: PropTypes.string,
  /** The text in usfm format to load in the editor */
  usfmText: PropTypes.string,
  /** bookId to identify the content in the editor */
  bookId: PropTypes.string,
  /** Whether to show extra info in the js console */
  verbose: PropTypes.bool,
  /** Book, chapter, verse to scroll to and highlight */
  activeReference: PropTypes.shape({
    bookId: PropTypes.string,
    chapter: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    verse: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  })
};

UsfmEditor.defaultProps = {
  verbose: false
}
