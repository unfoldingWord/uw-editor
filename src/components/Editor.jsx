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
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

import GraftPopup from "./GraftPopup"

export default function Editor( props) {
  const { onSave, epiteleteHtml, bookId, verbose } = props;
  const [graftSequenceId, setGraftSequenceId] = useState(null);

  // const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();
  const [orgUnaligned, setOrgUnaligned] = useState();
  const [brokenAlignedWords, setBrokenAlignedWords] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [blockIsEdited, setBlockIsEdited] = useState(false);
  const [hasUnsavedBlock, setHasUnsavedBlock] = useState(false);
  const [undoInx, setUndoInx] = useState(0)

  const bookCode = bookId.toUpperCase()
  const [lastSaveUndoInx, setLastSaveUndoInx] = useState(0)
  const readOptions = { readPipeline: "stripAlignmentPipeline" }
  
  const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
      let iCopy = Object.assign({}, item);
      delete iCopy[keyField]
      obj[item[keyField]] = iCopy;
      return obj
    }, {})

  const getFlatWordObj = (obj) => {
    const resArray = [];
    if (obj) {
      Object.entries(obj).forEach(([chNum, chObj]) => {
        Object.entries(chObj).forEach(([vNum, verseArr]) => {
          verseArr.forEach(wObj => {
            const occurrenceStr = (wObj?.totalOccurrences > 1) ? `-${wObj?.occurrence}/${wObj?.totalOccurrences}` : ""
            resArray.push({ id: `${chNum}:${vNum}-${wObj?.word}${occurrenceStr}`, wObj })
          })
        })
      })
    }
    return arrayToObject(resArray,"id")
  }

  useDeepCompareEffect(() => {
    if (epiteleteHtml) {
      //        epiteleteHtml.readHtml(bookCode,{},bcvQuery).then((_htmlPerf) => {
      epiteleteHtml.readHtml( bookCode, readOptions ).then((_htmlPerf) => {
        const _alignmentData = epiteleteHtml.getPipelineData(bookCode)
        setOrgUnaligned(getFlatWordObj(_alignmentData?.unalignedWords))
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteleteHtml, bookCode, setOrgUnaligned, setHtmlPerf]);

  
  const handleUnalignedClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const setHtmlAndUpdateUnaligned = (newHtmlPerf) => {
    const _alignmentData = epiteleteHtml.getPipelineData(bookCode)
    const nextUnalignedData = getFlatWordObj(_alignmentData?.unalignedWords)
    const diffUnaligned = Object.keys(orgUnaligned)
      .filter(x => !nextUnalignedData[x])
      .concat(Object.keys(nextUnalignedData).filter(x => !orgUnaligned[x]))
    setBrokenAlignedWords(diffUnaligned)
    setHasUnsavedBlock(true)
    setHtmlPerf(newHtmlPerf)
  }

  const popperOpen = Boolean(anchorEl);
  const id = popperOpen ? 'simple-popper' : undefined;
  
  const onInput = () => {
    if (!blockIsEdited) {
      setUndoInx(undoInx+1)
      setBlockIsEdited(true)
    }
  }

  const onHtmlPerf = useDeepCompareCallback(( _htmlPerf, { sequenceId }) => {

    setBlockIsEdited(false)
    const perfChanged = !isEqual(htmlPerf, _htmlPerf);
    if (perfChanged) setHtmlPerf(_htmlPerf);

    if (verbose) console.log('onhtmlperf', perfChanged)
    const saveNow = async () => {
      const writeOptions = { writePipeline: "mergeAlignmentPipeline", readPipeline: "stripAlignmentPipeline" }
      const newHtmlPerf = await epiteleteHtml.writeHtml( bookCode, sequenceId, _htmlPerf, writeOptions);
      if (verbose) console.log({ info: "Saved sequenceId", bookCode, sequenceId });

      const perfChanged = !isEqual(htmlPerf, newHtmlPerf);
      if (perfChanged) {
        setHtmlAndUpdateUnaligned(newHtmlPerf)
      }
    };
    saveNow()
  }, [htmlPerf, bookCode, orgUnaligned, setBrokenAlignedWords, setHtmlPerf]);

  const handleSave = async () => {
    setLastSaveUndoInx(undoInx)
    setBlockIsEdited(false)
    setHasUnsavedBlock(false)
    const usfmText = await epiteleteHtml.readUsfm( bookCode )
    onSave && onSave(bookCode,usfmText)
  }

  const undo = async () => {
    setUndoInx((undoInx>0)? undoInx-1 : 0)
    setBlockIsEdited(false)
    const newPerfHtml = await epiteleteHtml.undoHtml(bookCode, readOptions);
    setHtmlAndUpdateUnaligned(newPerfHtml);
  };

  const redo = async () => {
    setUndoInx(undoInx+1)
    setBlockIsEdited(false)
    const newPerfHtml = await epiteleteHtml.redoHtml(bookCode, readOptions);
    setHtmlAndUpdateUnaligned(newPerfHtml);
  };

  const canUndo = blockIsEdited || epiteleteHtml?.canUndo(bookCode);
  const canRedo = epiteleteHtml?.canRedo(bookCode);
  const canSave = (blockIsEdited || hasUnsavedBlock) && (lastSaveUndoInx !== undoInx)

  const handlers = {
    onBlockClick: ({ element }) => {
      const _sequenceId = element.dataset.target;
      // if (_sequenceId && !isInline) addSequenceId(_sequenceId);
      if (_sequenceId) setGraftSequenceId(_sequenceId);
    },
  };

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
    onInput,
    onHtmlPerf,
    sequenceIds,
    addSequenceId,
    components: {
      section: Section,
      sectionHeading: SectionHeading,
      sectionBody: SectionBody,
    },
    options,
    handlers,
    decorators: {},
    verbose,
  };


  const graftProps = {
    ...htmlEditorProps,
    options: { ...options, sectionable: false },
    sequenceIds: [graftSequenceId],
    graftSequenceId,
    setGraftSequenceId,
  };

  const buttonsProps = {
    sectionable,
    blockable,
    editable,
    preview,
    allAligned: (!brokenAlignedWords || brokenAlignedWords.length===0),
    onShowUnaligned: handleUnalignedClick,
    undo,
    redo,
    canUndo,
    canRedo,
    setToggles,
    canSave,
    onSave: handleSave,
    showToggles:false
  }

  return (
    <div key="1" className="Editor" style={style}>
      <Buttons {...buttonsProps} />
      <Popper id={id} open={popperOpen} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          List of words with broken alignment:
          <Box>
            {brokenAlignedWords && brokenAlignedWords.map((str,i) => <li key={i}>{str}</li>)}
          </Box>
        </Box>
      </Popper>
      {sequenceId && htmlPerf ? <HtmlPerfEditor {...htmlEditorProps} /> : skeleton}
      <GraftPopup {...graftProps} />
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
  /** Whether to show extra info in the js console */
  verbose: PropTypes.bool,
};

Editor.defaultProps = {
  verbose: false
}
