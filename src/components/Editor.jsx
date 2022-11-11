import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import isEqual from 'lodash.isequal';
import { HtmlPerfEditor } from "@xelah/type-perf-html";
import EpiteleteHtml from "epitelete-html";
import { Button, Skeleton, Stack } from "@mui/material";
import { PictureAsPdf } from '@mui/icons-material';
import useEditorState from "../hooks/useEditorState";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./SectionBody";
import Buttons from "./Buttons"
import EditorSearchReplace from './EditorSearchReplace';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

// import GraftPopup from "./GraftPopup"

export default function Editor( props) {
  const { onSave, epiteleteHtml, bookId, editable = true, verbose } = props;
  // const [graftSequenceId, setGraftSequenceId] = useState(null);

  // const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();
  const [orgUnaligned, setOrgUnaligned] = useState();
  const [brokenAlignedWords, setBrokenAlignedWords] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const bookCode = bookId.toUpperCase()
  const [lastSaveHistoryLength, setLastSaveHistoryLength] = useState(epiteleteHtml?.history[bookCode] ? epiteleteHtml.history[bookCode].stack.length : 1)
  const readOptions = { readPipeline: "stripAlignment" }
  
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
            resArray.push({ id: `${chNum}:${vNum}-${wObj?.word}`, wObj })
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
    setHtmlPerf(newHtmlPerf)
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const onHtmlPerf = useDeepCompareCallback(( _htmlPerf, { sequenceId }) => {
    const perfChanged = !isEqual(htmlPerf, _htmlPerf);
    if (perfChanged) setHtmlPerf(_htmlPerf);

    const saveNow = async () => {
      const writeOptions = { writePipeline: "mergeAlignment", readPipeline: "stripAlignment" }
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
    setLastSaveHistoryLength( epiteleteHtml?.history[bookCode].stack.length )
    const usfmText = await epiteleteHtml.readUsfm( bookCode )
    onSave && onSave(bookCode,usfmText)
  }

  const undo = async () => {
    const newPerfHtml = await epiteleteHtml.undoHtml(bookCode, readOptions);
    setHtmlAndUpdateUnaligned(newPerfHtml);
  };

  const redo = async () => {
    const newPerfHtml = await epiteleteHtml.redoHtml(bookCode, readOptions);
    setHtmlAndUpdateUnaligned(newPerfHtml);
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
      editable: _editable,
      preview: _preview,
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
    editable: _editable && editable,
    preview: _preview || editable,
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
    editable: _editable && editable,
    preview: _preview || !editable,
    allAligned: (!brokenAlignedWords || brokenAlignedWords.length===0),
    onShowUnaligned: handleUnalignedClick,
    undo,
    redo,
    canUndo,
    canRedo,
    setToggles,
    canSave,
    onSave: handleSave,
  }

  // const graftSequenceEditor = (
  //   <>
  //     <h2>Graft Sequence Editor</h2>
  //     <HtmlPerfEditor key="2" {...graftProps} />
  //   </>
  // );

  const onReplace = async () => {
    const newPerfHtml = await epiteleteHtml.readHtml(bookCode, readOptions);
    setHtmlAndUpdateUnaligned(newPerfHtml);
  }

  const editorSearchReplaceProps = {
    epiteleteHtml,
    bookCode,
    editable: _editable && editable && !_preview,
    onReplace,
  }

  return (
    <div key="1" className="Editor" style={style}>
      <EditorSearchReplace {...editorSearchReplaceProps}></EditorSearchReplace>
      {_preview || !editable && (
        <Button
          data-test-id="ButtonPreview"
          value="alignment"
          aria-label="pdf-preview"
          title="pdf-preview"
        >
          <PictureAsPdf />
        </Button>
      )}
      {editable && <Buttons {...buttonsProps} />}
      {editable && (<Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          List of words with broken alignment:
          <Box>
            {brokenAlignedWords && brokenAlignedWords.map((str,i) => <li key={i}>{str}</li>)}
          </Box>
        </Box>
      </Popper>)}
      {sequenceId && htmlPerf ? <HtmlPerfEditor {...htmlEditorProps} /> : skeleton}
      {/* <GraftPopup {...graftProps} /> */}
    </div>
  );
};

Editor.propTypes = {
  onSave: PropTypes.func,
  epiteleteHtml: PropTypes.instanceOf(EpiteleteHtml),
  bookId: PropTypes.string,
  editable: PropTypes.bool,
  verbose: PropTypes.bool,
};
