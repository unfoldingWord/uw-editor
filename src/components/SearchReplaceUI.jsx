import { Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function SearchReplaceUI(props) {
  const {
    groups,
    onSearch,
    // onClickGroup,
    // onClickResult,
    onReplaceAll,
    onReplaceGroup,
    onReplaceResult,
    // config = { isRegex: true },
  } = props;
  const [_groups, setGroups] = useState(groups);
  const [target, targetSet] = useState("");
  const [replacement, replacementSet] = useState("");
  
  const handleSearchChange = (event) => {
    targetSet(event.target.value);
  };
  const handleRepChange = (event) => {
    replacementSet(event.target.value);
  };
  useDeepCompareEffect(() => {
    setGroups(groups);
  },[groups])
  const groupKey = Object.keys(_groups)[0];
  console.log({ groupKey, group: _groups[groupKey]?.results?.[0] });
  return (
    <>
      <TextField
        id="outlined-multiline-flexible"
        label="Search"
        multiline
        maxRows={4}
        value={target}
        onChange={handleSearchChange}
      />
      <TextField
        id="outlined-multiline-flexible"
        label="Replace"
        multiline
        maxRows={4}
        value={replacement}
        onChange={handleRepChange}
      />
      <Button onClick={() => onSearch({ target, replacement })}>Search</Button>
      <Button onClick={() => onReplaceAll({ target, replacement })}>
        Replace All
      </Button>
      <Button onClick={() => onReplaceGroup({ target, replacement, group: _groups[groupKey] })}>
        Replace Group
      </Button>
      <Button onClick={() => onReplaceResult({ target, replacement, result: _groups[groupKey]?.results?.[0] })}>
        Replace First
      </Button>
      {groupKey && <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Results</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre>{JSON.stringify(_groups,null, 4)}</pre>
        </AccordionDetails>
      </Accordion>}
    </>

  );
}

export default SearchReplaceUI;

SearchReplaceUI.propTypes = {
  groups: PropTypes.object,
  onReplaceAll: PropTypes.func,
  onReplaceResult: PropTypes.func,
  onReplaceGroup: PropTypes.func,
  onSearch: PropTypes.func,
  onClickGroup: PropTypes.func,
  onClickResult: PropTypes.func,
};
