import * as React from "react";
import PropTypes from "prop-types";
import {
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { VscCaseSensitive, VscRegex, VscWholeWord } from "react-icons/vsc";

export function SearchBox({ defaultOptions = [], onChangeOptions, ...props }) {

  const [searchOptions, setSearchOptions] = React.useState(() => defaultOptions);

  const handleSearchOptions = (event, newOptions) => {
    setSearchOptions(newOptions);
    onChangeOptions(newOptions);
  };

  return (
    <>
      <TextField
        label="Search"
        size="small"
        margin={"dense"}
        maxRows={10}
        multiline
        {...props}

        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ToggleButtonGroup
                aria-label="search options"
                title="search options"
                size={"small"}
                value={searchOptions}
                onChange={handleSearchOptions}
              >
                <ToggleButton
                  value="isCaseMatched"
                  aria-label="isCaseMatched"
                  title="Match Case"
                >
                  <VscCaseSensitive size={"1.5em"} />
                </ToggleButton>
                <ToggleButton
                  value="isWordMatched"
                  aria-label="isWordMatched"
                  title="Match Whole Word"
                >
                  <VscWholeWord size={"1.5em"} />
                </ToggleButton>
                <ToggleButton
                  value="isRegex"
                  aria-label="isRegex"
                  title="Use Regular Expression"
                >
                  <VscRegex size={"1.5em"} />
                </ToggleButton>
              </ToggleButtonGroup>
            </InputAdornment>
          ),
          sx: { overflow: "hidden" },
        }}
      />
    </>
  );
}

SearchBox.propTypes = {
  onChangeOptions: PropTypes.func,
  defaultOptions: PropTypes.array
};