import * as React from "react";
import {
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { VscCaseSensitive, VscRegex, VscWholeWord } from "react-icons/vsc";

export function SearchBox(props) {
  const [searchOptions, setSearchOptions] = React.useState(() => [
    "isRegex",
    "isCaseSensitive",
    "shouldMatchWord",
  ]);

  const handleSearchOptions = (event, newOptions) => {
    setSearchOptions(newOptions);
  };

  console.log({ searchOptions });

  return (
    <>
      <TextField
        label="Search"
        size="medium"
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
                  value="isCaseSensitive"
                  aria-label="isCaseSensitive"
                  title="isCaseSensitive"
                >
                  <VscCaseSensitive size={"1.5em"} />
                </ToggleButton>
                <ToggleButton
                  value="shouldMatchWord"
                  aria-label="shouldMatchWord"
                  title="shouldMatchWord"
                >
                  <VscWholeWord size={"1.5em"} />
                </ToggleButton>
                <ToggleButton
                  value="isRegex"
                  aria-label="isRegex"
                  title="isRegex"
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
