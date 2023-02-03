import { /*Accordion, AccordionDetails, AccordionSummary,*/ Box, Button, createTheme, Dialog, DialogContent, DialogTitle, FormControl, IconButton, ThemeProvider, Typography,/* Typography*/ } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ListItemButton from '@mui/material/ListItemButton';
import { SearchBox } from "./SearchBox";
import { ReplaceBox } from "./ReplaceBox";
// import { ToggleButton, ToggleButtonGroup } from '@mui/material';
// import Tooltip from '@mui/material/Tooltip';
// import DoneIcon from '@mui/icons-material/Done';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { VscReplace, VscReplaceAll, VscClose } from "react-icons/vsc";
import { useDebouncedCallback } from "use-debounce";

// import { VscReplace } from "react-icons/vsc";

// import { keys } from "translation-helps-rcl/dist/core/branching";

function ResultDialogTitle(props) {
  const { children, onClose, onReplace,...other } = props;
  console.log({onClose})
  return (
    <DialogTitle sx={{ m: 0, p: 2, display: "flex" }} {...other}>
      <Box sx={{flexGrow:1}}>{children}</Box>
      <Box>
        <IconButton aria-label="Replace Result" title="Replace Result" size="small" onClick={onReplace}>
          <VscReplace fontSize="inherit" />
        </IconButton>
        {onClose ? (
          <IconButton
            aria-label="close"
            title="Close"
            size="small"
            onClick={onClose}
          >
            <VscClose />
          </IconButton>
        ) : null}
      </Box>
    </DialogTitle>
  );
}
ResultDialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onReplace: PropTypes.func,
};

function ResultDialog(props) {
  const {
    result,
    onReplace,
    onClose,
    ...other
  } = props;

  const { extContext, match, replacement, metadata } = result;

  return result ? (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        {...other}
      >
        <ResultDialogTitle id="customized-dialog-title" onClose={onClose} onReplace={onReplace}>
          {metadata?.bookCode}{" "}{metadata?.chapter}:{metadata?.verses}
        </ResultDialogTitle>
        <DialogContent dividers>
          <SearchResult context={extContext} match={match} replacement={replacement} />
        </DialogContent>
      </Dialog>
    </div>
  ) : null;
}

ResultDialog.propTypes = {
  result: PropTypes.object,
  onReplace: PropTypes.func,
  onClose: PropTypes.func,
};

function Match(props) {
  const { children, replaced } = props;
  const style = replaced ? {
    backgroundColor: "#ffe3e3",
    textDecoration: "line-through",
    textDecorationColor: "#eea9a9"
  } : {
    backgroundColor: "#e3e5ff"
  }
  return <mark style={style}>{children}</mark>
}

Match.propTypes = {
  children: PropTypes.node.isRequired,
  replaced: PropTypes.bool,
};

function ResultLabel({children, ...props }) {
  return <div style={{width:"auto"}} {...props}>{children}</div>
  
}
ResultLabel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};
function Replacement(props) {
  const { children } = props;
  const style = {
    backgroundColor: "#e3ffe5",
  }
  return <mark style={style}>{children}</mark>
}

Replacement.propTypes = {
  children: PropTypes.node.isRequired,
};

function SearchResult(props) {
  const {
    context = { before: "", after: "" },
    match,
    replacement = "",
    ellipsis = "",
    ...other
  } = props;
  return (
    <Typography width={"100%"} variant={"string"} {...other}>
      {ellipsis}{context.before}
      <Match replaced={!!replacement}>{match}</Match>
      <Replacement>{replacement}</Replacement>
      {context.after}{ellipsis}
    </Typography>
  )
}

const theme = createTheme({
  components: {
    MuiTreeItem: {
      styleOverrides: {
        content: {
          width: 'auto',
        },
      },
    },
  },
});

function ResultsTreeItem(props) {
  return (
    <ThemeProvider theme={theme}>
      <TreeItem {...props} />
    </ThemeProvider>
  );
}

function ReplaceButton({children,...props}) {
  return <FormControl margin={"dense"}>
    <Button
      {...props}
    >
      {children}
    </Button>
  </FormControl>
}

ReplaceButton.propTypes = {
  children: PropTypes.node.isRequired,
};

SearchResult.propTypes = {
  context: PropTypes.object,
  match: PropTypes.string,
  replacement: PropTypes.string,
  ellipsis: PropTypes.string,
};

const defaultOptions = {
  isCaseMatched: false,
  isWordMatched: false,
  isRegex: false,
  isCasePreserved: false,
}

function SearchReplaceUI(props) {
  const {
    groups,
    onSearch,
    // onClickGroup,
    // onClickResult,
    onReplaceAll,
    // onReplaceGroup,
    onReplaceResult,
    // config = { isRegex: true },
  } = props;
  const [options, setOptions] = useState(defaultOptions);
  const [_groups, setGroups] = useState(groups);
  const [target, targetSet] = useState("");
  const [replacement, replacementSet] = useState("");
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({});

  const handleCloseDialog = function () {
    setOpen(false);
  }
  
  const onClickResult = function (result) {
    setResult(result);
    setOpen(true)
  }

  const onReplaceDialog = function () {
    onReplaceResult({ target, replacement, result, options });
    setOpen(false);
  }

  const debouncedTarget = useDebouncedCallback((value) => {
    targetSet(value);
  }, 300);

  const debouncedReplace = useDebouncedCallback((value) => {
    replacementSet(value);
  },300);

  const handleSearchChange = (event) => {
    debouncedTarget(event.target.value);
  };

  const handleRepChange = (event) => {
    debouncedReplace(event.target.value);
  };
  
  useDeepCompareEffect(() => {
    if (target !== "") {
      console.log({options})
      onSearch({ target, replacement, options })
    }else{
      setGroups({})
    }
  }, [target, replacement, options ]);

  // const handleGroup = (e) => {
  //   console.log(e.target.value);
  //   onReplaceAll({group: e.target?.value, target:target, replacement:replacement})
  // }

  const onChangeSearchOptions = (newSearchOptions) => {
    const searchOptions = newSearchOptions.reduce((options, keys) => {
      options[keys] = true
      return options
    }, { isWordMatched: false, isCaseMatched: false, isRegex: false })
    setOptions(options => ({...defaultOptions,...options, ...searchOptions}))
  }

  const onChangeReplaceOptions = (newReplaceOptions) => {
    const replaceOptions = newReplaceOptions.reduce((options, keys) => {
      options[keys] = true
      return options
    }, { isCasePreserved: false })
    setOptions(options => ({...options, ...replaceOptions}))
  }

  useDeepCompareEffect(() => {
    setGroups(groups);
  },[groups])

  const groupKey = Object.keys(_groups)[0];
  let _groupsValue = _groups[groupKey]
  console.log({ groupKey, group: _groups[groupKey]?.results?.[0] });

  return (
    <>
      <ResultDialog result={result} open={open} onReplace={onReplaceDialog} onClose={handleCloseDialog} />
      <Box sx={{display: 'grid'}}>
        <SearchBox 
          defaultOptions={[]}
          onChange={handleSearchChange}
          onChangeOptions={onChangeSearchOptions}
        />
        <Box sx={{display: 'grid', gap:"0.5em", gridTemplateColumns:"auto min-content min-content"}}>
          <ReplaceBox 
            defaultOptions={[]}
            onChange={handleRepChange}
            onChangeOptions={onChangeReplaceOptions}
          />
          <ReplaceButton
            onClick={() => {
              onReplaceResult({ target, replacement, result: _groups[groupKey]?.results?.[0], options })
            }}
            variant="contained"
            sx={{ height: "100%" }}
            title="Replace Next"
          >
            <VscReplace fontSize="1.3em" style={{margin:"auto"}} />
          </ReplaceButton>
          <ReplaceButton
            onClick={() => {
              onReplaceAll({ target, replacement, group: _groupsValue, options })
            }}
            variant="contained"
            sx={{ height: "100%" }}
            title="Replace All"
          >
            <VscReplaceAll fontSize="1.3em" style={{margin:"auto"}} />
          </ReplaceButton>
        </Box>
        
      </Box>
      {groupKey && 
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, width: "auto", overflowY: 'auto' }}
        label={_groupsValue.key}
      >
        {/* <TreeItem
          nodeId="1"
          label={
            <ResultLabel tooltip={_groupsValue.hoverText}>
              {_groupsValue.key}
            </ResultLabel>
          }
        > */}
        {_groupsValue?.results?.map((value, index) => (
          <ResultsTreeItem
            key={value.key}
            nodeId={_groupsValue.key + value.match + index}
            label={
              <ResultLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'inherit', flexGrow: 1, width: "auto" }}
                    title={value.metadata.bookCode + " " + value.metadata.chapter + ":" + value.metadata.verses}
                    onClick={() => onClickResult(value)}
                  >
                    <SearchResult
                      ellipsis={"…"}
                      context={value.context}
                      match={value.match}
                      replacement={value.replacement}
                      noWrap={true}
                    />
                  </Typography>
                  <Box variant="caption" color="inherit" sx={{display: 'grid', gridTemplateColumns: "auto auto"}}>
                    <IconButton aria-label="Replace Result" title="Replace Result" size="small" onClick={() => onReplaceResult({ target, replacement, result: value, options })}>
                      <VscReplace fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      aria-label="Dismiss result"
                      size="small"
                      title="Dismiss result"
                      onClick={() => setGroups(groups => ({
                        ...groups,
                        [groupKey]: {
                          ..._groupsValue,
                          results: _groupsValue?.results.filter((_, i) => index !== i)
                        }
                      }))}
                    >
                      <VscClose fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Box>
              </ResultLabel>
            }
          />
        ))}
        {/* </TreeItem> */}
      </TreeView>
      }
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
