import * as React from "react";
import PropTypes from "prop-types";
import {
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { VscPreserveCase } from "react-icons/vsc";

export function ReplaceBox({ defaultOptions = [], onChangeOptions, ...props }) {
  const [replaceOptions, setReplaceOptions] = React.useState(() => defaultOptions);

  const handleReplaceOptions = (event, newOptions) => {
    setReplaceOptions(newOptions);
    onChangeOptions(newOptions);
  };

  return (
    <>
      <TextField
        {...props}
        label="Replace"
        size="small"
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
                  value="isCasePreserved"
                  aria-label="isCasePreserved"
                  title="Preserve Case"
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

ReplaceBox.propTypes = {
  onChangeOptions: PropTypes.func,
  defaultOptions: PropTypes.array
};