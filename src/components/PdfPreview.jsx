import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from "use-deep-compare";
import useEditorState from "../hooks/useEditorState";
import usePrintPreview from "../hooks/usePrintPreview";
import { HtmlPerfEditor } from "@xelah/type-perf-html";
import EpiteleteHtml from "epitelete-html";
import { Skeleton, Stack } from "@mui/material";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./SectionBody";

export default function PdfPreview( props) {
  const { epiteleteHtml, bookId, verbose } = props;
  const [htmlPerf, setHtmlPerf] = useState();
  
  const bookCode = bookId.toUpperCase()
  const readOptions = { readPipeline: "stripAlignment" }
  
  useDeepCompareEffect(() => {
    if (epiteleteHtml) {
      //        epiteleteHtml.readHtml(bookCode,{},bcvQuery).then((_htmlPerf) => {
      epiteleteHtml.readHtml( bookCode, readOptions ).then((_htmlPerf) => {
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteleteHtml, bookCode, setHtmlPerf]);

  let sequenceIds
  sequenceIds = [htmlPerf?.mainSequenceId]
  const sequenceId = htmlPerf?.mainSequenceId;

  const style = (/*isSaving  ||*/ !sequenceId) ? { cursor: 'progress' } : {};

  const {
    actions: {
      setSequenceIds,
      addSequenceId,
      setSequenceId,
    },
  } = useEditorState({sequenceIds: [htmlPerf?.mainSequenceId], ...props});

  const onHtmlPerf = () => console.log("onHtmlPerf")

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
    sectionable: false,
    blockable: false,
    editable: false,
    preview: true
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

  const component = (
    <div key="1" className="PdfPreview" style={style}>
      { sequenceId && htmlPerf ? <HtmlPerfEditor {...htmlPdfPreviewProps} /> : skeleton }
    </div>
  )
  const printPreviewComponent = usePrintPreview({ component, embed: true });

  return printPreviewComponent
};

PdfPreview.propTypes = {
  onSave: PropTypes.func,
  epiteleteHtml: PropTypes.instanceOf(EpiteleteHtml),
  bookId: PropTypes.string,
  verbose: PropTypes.bool,
};
