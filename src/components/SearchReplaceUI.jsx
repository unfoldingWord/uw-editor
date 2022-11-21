import { /*Accordion, AccordionDetails, AccordionSummary,*/ Button,/* Typography*/ } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ListItemButton from '@mui/material/ListItemButton';
import Grid from "@mui/material/Grid";
import { SearchBox } from "./snr-ui-components/SearchBox";
import { ReplaceBox } from "./snr-ui-components/ReplaceBox";
// import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
// import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
// import { VscReplace } from "react-icons/vsc";

// import { keys } from "translation-helps-rcl/dist/core/branching";

function SearchReplaceUI(props) {
  const {
    groups,
    onSearch,
    // onClickGroup,
    // onClickResult,
    onReplaceAll,
    // onReplaceGroup,
    // onReplaceResult,
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
    // console.log(event.target.value)
  };
  
  const handleGroup = (e) => {
    console.log(e.target.value);
    onReplaceAll({group: e.target?.value, target:target, replacement:replacement})
  }

  useDeepCompareEffect(() => {
    setGroups(groups);
  },[groups])

  const groupKey = Object.keys(_groups)[0];
  let _groupsValue = _groups[groupKey]
  console.log({ groupKey, group: _groups[groupKey]?.results?.[0] });

  // const handleReplacement = (value) => {
  //   const resultKey = value?.key
  //   console.log(resultKey)
  //   _groupsValue?.results?.map((value)=>{
  //     if(value.key === resultKey){
  //       console.log(value.groupKey);
  //       let indexArray = _groupsValue?.results?.indexOf(value)
  //       console.log(_groupsValue);
  //       onReplaceResult({target:target, replacement:replacement, result:_groupsValue?.results?.[indexArray]})
  //     }
  //   })
  // }

  // const onHandleDelete =(value) => {
  //   console.log(value);
  //   const indexValue = value;
  //   _groupsValue.results.map((value)=>{
  //     if(value.key === indexValue){
  //       const indexArray = _groupsValue.results.indexOf(value)
  //       _groupsValue.results.splice(indexArray,1)
  //       // setGroups(_groupsValue)
  //       console.log(_groupsValue);
  //     }
  //   })
  // }

  return (
    <>
      {console.log(target)}
      <SearchBox 
        value={target}
        onChange={handleSearchChange}
      />
      <ReplaceBox 
        value={replacement}
        onChange={handleRepChange}
      />
      <Button onClick={() => onSearch({ target, replacement })}>Search</Button>
      {/*<Button onClick={() => onReplaceAll({ target, replacement })}>
        Replace All
      </Button>
      <Button onClick={() => onReplaceGroup({ target, replacement, group: _groups[groupKey] })} disabled={!groupKey}>
        Replace Group
      </Button>
      <Button onClick={() => onReplaceResult({ target, replacement, result: _groups[groupKey]?.results?.[0] })} disabled={!groupKey}>
        Replace First
      </Button> */}
      {groupKey && 
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 500, overflowY: 'auto' }}
        label={_groupsValue.key}
      >
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Tooltip title={_groupsValue.hoverText} placement="top-start">
              <TreeItem nodeId="1" label={_groupsValue.key}>
                {_groupsValue?.results?.map((value) =>(
                  <Tooltip title={value.metadata.bookCode + " " + value.metadata.chapter + ":" + value.metadata.verses} placement="top-start" key={value.metadata.bookCode}>
                    {/* <Grid container spacing={3}>
                      <Grid item xs={8}> */}
                    <TreeItem nodeId={value.text} label={value.text} />
                    {/* endIcon={
                             <VscReplace value={value.text} onClick={()=>handleReplacement(value)}/>
                        }  */}
                    {/* </Grid>
                      <Grid item xs={2}>
                        <ToggleButtonGroup 
                          aria-label="text formatting"
                          title="Replace"
                          size={"small"} 
                          value={value.text} 
                          onClick={()=>handleReplacement(value)} 
                          // style={{ paddingBlockEnd: '0px', paddingBlockStart: '0px'}}
                        >
                          <ToggleButton
                            value="shouldMatchCase"
                            aria-label="Replace"
                            title="Replace"
                          >
                            <VscReplace size={"1em"} />
                          </ToggleButton>   
                        </ToggleButtonGroup>
                      </Grid>
                      <Grid item xs={2}>
                        <CloseIcon style={{fontSize:'medium'}} value={value.metadata.searchIndex} onClick={()=>onHandleDelete(value.key)} />
                      </Grid>
                    </Grid> */}
                  </Tooltip>))}
              </TreeItem>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <DoneAllIcon value={_groupsValue.key} onClick={handleGroup} />
          </Grid>
          <Grid item xs={1}>
            <CloseIcon style={{fontSize:'medium', marginTop:'0.75em'}} />
          </Grid>
        </Grid>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="MUI">
            <TreeItem nodeId="8" label="index.js" />
          </TreeItem>
        </TreeItem>
      </TreeView>
      // <Accordion>
      //   <AccordionSummary
      //     // expandIcon={<ExpandMoreIcon />}
      //     aria-controls="panel1a-content"
      //     id="panel1a-header"
      //   >
      //     <Grid container spacing={2}>
      //       <Grid item xs={10}>
      //         <Tooltip title={_groupsValue.hoverText} placement="top-start">
      //           <Typography>
      //             {_groupsValue.key}
      //           </Typography>
      //         </Tooltip>
      //       </Grid>
      //       <Grid item xs={1}>
      //         <DoneAllIcon value={_groupsValue.key} onClick={handleGroup} />
      //       </Grid>
      //       <Grid item xs={1}>
      //         <CloseIcon style={{fontSize:'medium', marginTop:'0.75em'}} />
      //       </Grid>
      //     </Grid>
      //     <Typography>{console.log(_groupsValue)}</Typography>
      //   </AccordionSummary>
      //   <AccordionDetails >
      //     {console.log(_groupsValue)}
      //     {_groupsValue?.results?.map((value) =>(
      //       <Tooltip title={value.metadata.bookCode + " " + value.metadata.chapter + ":" + value.metadata.verses} placement="top-start" key={value.metadata.bookCode}>
      //         <ListItemButton key={value}>
      //           <Grid container spacing={2}>
      //             <Grid item xs={10}>
      //               {value.text}
      //             </Grid>
      //             <Grid item xs={1}>
      //               <ListItemButton value={value.text} onClick={()=>handleReplacement(value)}>
      //                 <DoneIcon />
      //               </ListItemButton>
      //             </Grid>
      //             <Grid item xs={1}>
      //               <CloseIcon style={{fontSize:'medium', marginTop:'0.50em'}} value={value.metadata.searchIndex} onClick={()=>onHandleDelete(value.key)} />
      //             </Grid>
      //           </Grid>
      //         </ListItemButton>
      //       </Tooltip>))}
      //   </AccordionDetails>
      // </Accordion>
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
