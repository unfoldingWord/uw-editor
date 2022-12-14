import { useState, useCallback } from "react";
import PropTypes from 'prop-types';

export default function useEditorState(props) {
  const initialState = {
    sequenceId: null,
    sequenceIds: [],
    sectionable: true,
    blockable: true,
    editable: true,
    preview: true,
    ...props
  };

  const [state, setState] = useState(initialState);

  const setSectionable = useCallback((sectionable) => {
    setState((prev) => ({ ...prev, sectionable }));
  }, []);

  const setBlockable = useCallback((blockable) => {
    setState((prev) => ({ ...prev, blockable }));
  }, []);

  const setEditable = useCallback((editable) => {
    setState((prev) => ({ ...prev, editable }));
  }, []);

  const setPreview = useCallback((preview) => {
    setState((prev) => ({ ...prev, preview }));
  }, []);

  const setToggles = useCallback((toggles) => {
    setState((prev) => ({ ...prev, ...toggles }));
  }, []);

  const setSequenceIds = useCallback((sequenceIds) => {
    setState((prev) => ({ ...prev, sequenceIds }));
  }, []);

  const setSequenceId = useCallback((sequenceId) => {
    setState((prev) => ({ ...prev, sequenceId }));
  }, []);

  const addSequenceId = useCallback(
    (_sequenceId) => {
      setSequenceIds([...state.sequenceIds, _sequenceId]);
    },
    [state.sequenceIds, setSequenceIds]
  );

  const actions = {
    setSectionable,
    setBlockable,
    setEditable,
    setPreview,
    setToggles,
    setSequenceIds,
    addSequenceId,
    setSequenceId,
  };

  return { state, actions };
};

useEditorState.propTypes = {
  sequenceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  sectionable: PropTypes.bool,
  blockable: PropTypes.bool,
  editable: PropTypes.bool,
  preview: PropTypes.bool,
};
