import { Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from "@mui/material/Grid";
// import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
// import { keys } from "translation-helps-rcl/dist/core/branching";

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

  const handleReplacement = (value) => {
    const resultKey = value?.key
    console.log(resultKey)
    _groupsValue?.results?.map((value)=>{
      if(value.key === resultKey){
        console.log(value.groupKey);
        let indexArray = _groupsValue?.results?.indexOf(value)
        console.log(_groupsValue);
        onReplaceResult({target:target, replacement:replacement, result:_groupsValue?.results?.[indexArray]})
      }
    })
  }

  const onHandleDelete =(value) => {
    console.log(value);
    const indexValue = value;
    _groupsValue.results.map((value)=>{
      if(value.key === indexValue){
        const indexArray = _groupsValue.results.indexOf(value)
        _groupsValue.results.splice(indexArray,1)
        // setGroups(_groupsValue)
        console.log(_groupsValue);
      }
    })
  }

  return (
    <>
      {console.log(target)}
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
      {/*<Button onClick={() => onReplaceAll({ target, replacement })}>
        Replace All
      </Button>
      <Button onClick={() => onReplaceGroup({ target, replacement, group: _groups[groupKey] })} disabled={!groupKey}>
        Replace Group
      </Button>
      <Button onClick={() => onReplaceResult({ target, replacement, result: _groups[groupKey]?.results?.[0] })} disabled={!groupKey}>
        Replace First
      </Button> */}
      {groupKey && <Accordion>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Tooltip title={_groupsValue.hoverText} placement="top-start">
                <Typography>
                  {_groupsValue.key}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <DoneAllIcon value={_groupsValue.key} onClick={handleGroup} />
            </Grid>
            <Grid item xs={1}>
              <CloseIcon style={{fontSize:'medium', marginTop:'0.75em'}} />
            </Grid>
          </Grid>
          <Typography>{console.log(_groupsValue)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          {console.log(_groupsValue)}
          {_groupsValue?.results?.map((value) =>(
            <Tooltip title={value.metadata.bookCode + " " + value.metadata.chapter + ":" + value.metadata.verses} placement="top-start" key={value.metadata.bookCode}>
              <ListItemButton key={value}>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    {value.text}
                  </Grid>
                  <Grid item xs={1}>
                    <ListItemButton value={value.text} onClick={()=>handleReplacement(value)}>
                      <DoneIcon />
                    </ListItemButton>
                  </Grid>
                  <Grid item xs={1}>
                    <CloseIcon style={{fontSize:'medium', marginTop:'0.50em'}} value={value.metadata.searchIndex} onClick={()=>onHandleDelete(value.key)} />
                  </Grid>
                </Grid>
              </ListItemButton>
            </Tooltip>))}
          {/* <pre>{JSON.stringify(_groups,null, 4)}</pre> */}
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
