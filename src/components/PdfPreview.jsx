import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import isEqual from 'lodash.isequal';
import { HtmlPerfPdfPreview } from "@xelah/type-perf-html";
import EpiteleteHtml from "epitelete-html";

import { Skeleton, Stack } from "@mui/material";
import usePdfPreviewState from "../hooks/usePdfPreviewState";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./SectionBody";
import Buttons from "./Buttons"

// import GraftPopup from "./GraftPopup"

export default function PdfPreview( props) {
  const { onSave, epiteleteHtml, bookId, verbose } = props;
  // const [graftSequenceId, setGraftSequenceId] = useState(null);

  // const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();

  const bookCode = bookId.toUpperCase()
  const [lastSaveHistoryLength, setLastSaveHistoryLength] = useState(epiteleteHtml?.history[bookCode] ? epiteleteHtml.history[bookCode].stack.length : 1)
  const readOptions = { readPipeline: "stripAlignment" }

  useDeepCompareEffect(() => {
    if (epiteleteHtml) {
      //        epiteleteHtml.readHtml(bookCode,{},bcvQuery).then((_htmlPerf) => {
      epiteleteHtml.readHtml( bookCode, readOptions ).then((_htmlPerf) => {
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteleteHtml, bookCode]);

  const onHtmlPerf = useDeepCompareCallback(( _htmlPerf, { sequenceId }) => {
    const perfChanged = !isEqual(htmlPerf, _htmlPerf);
    if (perfChanged) setHtmlPerf(_htmlPerf);

    const saveNow = async () => {
      const writeOptions = { writePipeline: "mergeAlignment", readPipeline: "stripAlignment" }
      const newHtmlPerf = await epiteleteHtml.writeHtml( bookCode, sequenceId, _htmlPerf, writeOptions);
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
  } = usePdfPreviewState({sequenceIds: [htmlPerf?.mainSequenceId], ...props});

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
  const htmlPdfPreviewProps = {
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
  //   ...htmlPdfPreviewProps,
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

  // const graftSequencePdfPreview = (
  //   <>
  //     <h2>Graft Sequence PdfPreview</h2>
  //     <HtmlPerfPdfPreview key="2" {...graftProps} />
  //   </>
  // );

  return (
    <div key="1" className="PdfPreview" style={style}>
      <Buttons {...buttonsProps} />
      {sequenceId && htmlPerf ? <HtmlPerfPdfPreview {...htmlPdfPreviewProps} /> : skeleton}
      {/* <GraftPopup {...graftProps} /> */}
    </div>
  );
};

PdfPreview.propTypes = {
  onSave: PropTypes.func,
  epiteleteHtml: PropTypes.instanceOf(EpiteleteHtml),
  bookId: PropTypes.string,
  verbose: PropTypes.bool,
};
