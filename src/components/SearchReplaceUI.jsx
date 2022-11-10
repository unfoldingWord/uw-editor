import { Button, TextField } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";

function SearchReplaceUI(props) {
  const {
    // groups,
    onSearch,
    // onClickGroup,
    // onClickResult,
    onReplaceAll,
    // onReplaceGroup,
    // onReplaceResult,
    // config = { isRegex: true },
  } = props;
  const [target, targetSet] = useState("");
  const [replacement, replacementSet] = useState("");

  const handleSearchChange = (event) => {
    targetSet(event.target.value);
  };
  const handleRepChange = (event) => {
    replacementSet(event.target.value);
  };
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
    </>
  );
}

export default SearchReplaceUI;

SearchReplaceUI.propTypes = {
  onReplaceAll: PropTypes.func,
  onSearch: PropTypes.func,
  onClickGroup: PropTypes.func,
  onClickResult: PropTypes.func,
};
