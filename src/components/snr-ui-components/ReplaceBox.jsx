import * as React from "react";
import {
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { VscPreserveCase } from "react-icons/vsc";

export function ReplaceBox(props) {
  const [replaceOptions, setReplaceOptions] = React.useState(() => [
    "isRegex",
    "shouldMatchCase",
    "isCaseSensitive",
    "shouldMatchWord",
  ]);

  const handleReplaceOptions = (event, newOptions) => {
    setReplaceOptions(newOptions);
  };

  console.log({ replaceOptions });

  return (
    <>
      <TextField
        {...props}
        label="Replace"
        size="medium"
        margin={"dense"}
        maxRows={10}
        multiline
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ToggleButtonGroup
                aria-label="text formatting"
                title="text formatting"
                size={"small"}
                value={replaceOptions}
                onChange={handleReplaceOptions}
              >
                <ToggleButton
                  value="shouldMatchCase"
                  aria-label="shouldMatchCase"
                  title="shouldMatchCase"
                >
                  <VscPreserveCase size={"1.5em"} />
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
