import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import isEqual from 'lodash.isequal';
import { HtmlPerfEditor } from "@xelah/type-perf-html";
import EpiteleteHtml from "epitelete-html";

import { Skeleton, Stack } from "@mui/material";
import useEditorState from "../hooks/useEditorState";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./SectionBody";
import Buttons from "./Buttons"

// import GraftPopup from "./GraftPopup"

export default function Editor( props) {
  const { onSave, epiteleteHtml, bookId, bcvQuery, verbose } = props;
  // const [graftSequenceId, setGraftSequenceId] = useState(null);

  // const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();

  let _bookId = bookId

  if (bcvQuery) {
    const books = Object.keys(bcvQuery?.book)
    _bookId = books[0] || bookId || ""
  }
  
  const bookCode = _bookId.toUpperCase()
  const [lastSaveHistoryLength, setLastSaveHistoryLength] = useState(epiteleteHtml?.history[bookCode] ? epiteleteHtml.history[bookCode].stack.length : 1)
  const readOptions = { readPipeline: "stripAlignment" }

  useDeepCompareEffect(() => {
    if (epiteleteHtml) {
      epiteleteHtml.readHtml( bookCode, readOptions, bcvQuery ).then((_htmlPerf) => {
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteleteHtml, bookCode]);

  const onHtmlPerf = useDeepCompareCallback(( _htmlPerf, { sequenceId }) => {
    const perfChanged = !isEqual(htmlPerf, _htmlPerf);
    if (perfChanged) setHtmlPerf(_htmlPerf);

    const saveNow = async () => {
      const writeOptions = { writePipeline: "mergeAlignment", readPipeline: "stripAlignment" }
      const newHtmlPerf = await epiteleteHtml.writeHtml( bookCode, sequenceId, _htmlPerf, writeOptions, bcvQuery);
      if (verbose) console.log({ info: "Saved sequenceId", bookCode, sequenceId });

      const perfChanged = !isEqual(htmlPerf, newHtmlPerf);
      if (perfChanged) setHtmlPerf(newHtmlPerf);
    };
    saveNow()
  }, [htmlPerf, bookCode]);

  const handleSave = async () => {
    setLastSaveHistoryLength( epiteleteHtml?.history[bookCode].stack.length )
    const usfmText = await epiteleteHtml.readUsfm( bookCode )
    onSave && onSave(bookCode,usfmText)
  }

  const undo = async () => {
    const newPerfHtml = await epiteleteHtml.undoHtml(bookCode, readOptions);
    setHtmlPerf(newPerfHtml);
  };

  const redo = async () => {
    const newPerfHtml = await epiteleteHtml.redoHtml(bookCode, readOptions);
    setHtmlPerf(newPerfHtml);
  };

  const canUndo = epiteleteHtml?.canUndo(bookCode);
  const canRedo = epiteleteHtml?.canRedo(bookCode);
  const canSave = epiteleteHtml?.history[bookCode] && epiteleteHtml.history[bookCode].stack.length > lastSaveHistoryLength;

  // const handlers = {
  //   onBlockClick: ({ element }) => {
  //     const _sequenceId = element.dataset.target;
  //     // if (_sequenceId && !isInline) addSequenceId(_sequenceId);
  //     if (_sequenceId) setGraftSequenceId(_sequenceId);
  //   },
  // };

  const {
    state: {
      sectionable,
      blockable,
      editable,
      preview,
    },
    actions: {
      setSequenceIds,
      addSequenceId,
      setSequenceId,
      setToggles,
    },
  } = useEditorState({sequenceIds: [htmlPerf?.mainSequenceId], ...props});

  let sequenceIds
  sequenceIds = [htmlPerf?.mainSequenceId]
  const sequenceId = htmlPerf?.mainSequenceId;

  const style = (/*isSaving  ||*/ !sequenceId) ? { cursor: 'progress' } : {};

  useEffect(() =>{
    if( htmlPerf && ! sequenceIds ) {
      setSequenceIds([htmlPerf.mainSequenceId])
      setSequenceId(htmlPerf.mainSequenceId)
    }
  }, [htmlPerf, sequenceIds, setSequenceId, setSequenceIds]
  )

  const skeleton = (
    <Stack spacing={1}>
      <Skeleton key='1' variant="text" height="8em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='2' variant="rectangular" height="16em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='3' variant="text" height="8em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='4' variant="rectangular" height="16em" sx={{ bgcolor: 'white' }} />
    </Stack>
  );

  const options = {
    sectionable,
    blockable,
    editable,
    preview
  };
  const htmlEditorProps = {
    htmlPerf,
    onHtmlPerf,
    sequenceIds,
    addSequenceId,
    components: {
      section: Section,
      sectionHeading: SectionHeading,
      sectionBody: SectionBody,
    },
    options,
    // handlers,
    decorators: {},
    verbose,
  };


  // const graftProps = {
  //   ...htmlEditorProps,
  //   options: { ...options, sectionable: false },
  //   sequenceIds: [graftSequenceId],
  //   graftSequenceId,
  //   setGraftSequenceId,
  // };

  const buttonsProps = {
    sectionable,
    blockable,
    editable,
    preview,
    undo,
    redo,
    canUndo,
    canRedo,
    setToggles,
    canSave,
    onSave:handleSave,
  }

  // const graftSequenceEditor = (
  //   <>
  //     <h2>Graft Sequence Editor</h2>
  //     <HtmlPerfEditor key="2" {...graftProps} />
  //   </>
  // );

  return (
    <div key="1" className="Editor" style={style}>
      <Buttons {...buttonsProps} />
      {sequenceId && htmlPerf ? <HtmlPerfEditor {...htmlEditorProps} /> : skeleton}
      {/* <GraftPopup {...graftProps} /> */}
    </div>
  );
};

Editor.propTypes = {
  /** Method to call when save button is pressed */
  onSave: PropTypes.func,
  /** Instance of EpiteleteHtml class */
  epiteleteHtml: PropTypes.instanceOf(EpiteleteHtml),
  /** bookId to identify the content in the editor */
  bookId: PropTypes.string,
  /** bcvQuery to identify verses and chapters as content in the editor */
  bcvQuery: PropTypes.any,
  /** Whether to show extra info in the js console */
  verbose: PropTypes.bool,
};

Editor.defaultProps = {
  verbose: false
}
