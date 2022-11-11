import { useState } from 'react'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import Highlighter from "react-highlight-words";
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Grid from "@mui/material/Grid";
import PropTypes from 'prop-types';

export default function SearchAndReplace({
  // results,
  // groups,
  target, //initial string on the search box
  replacement, //initial string on the replace box
  onSearch,
  // onClickGroup,
  // onClickResult,
  // onReplaceAll,
  // onReplaceGroup,
  // onReplaceResult,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState(target);
  const [/*replaceText*/, setReplaceText] = React.useState(replacement);
  const [_groups, /*set_groups*/ ] = React.useState();
  const [selectAll, setSelectAll] = React.useState(false);
  const [checked, setChecked] = useState([]);
  //   const [] = useState();
   
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleChange = (e) => {
    const indexArray = checked.indexOf(e.target.value)
    if(indexArray === -1){
      setChecked([...checked, e.target.value])
    }else{
      setChecked((checked.filter(check => check !== e.target.value)))
    }
  };
  
  const handleClose = () => {
    setSearchText()
    setOpen(false);
  };
  //   const handleDeleteItem = (item, index) => {
  //     set_groups(_groups.splice(index, 1))
  //   }

 
  const handleSelectAll = (e) => {
    const checkValue = e.target.checked;
    const indexArray = [];
    if (checkValue) {
      _groups.forEach((value, index) => {
        const currentBook = index;
        if (!checked.includes(currentBook)) {
          indexArray.push(index.toString());
        }
      });
    }
    setChecked(indexArray);
    setSelectAll(e.target.checked);
  };

  const onHandleSearchText = (e) => {
    setSearchText(e.target.value)
    setChecked([])
    setSelectAll(false)
    onSearch({target: e.target.value})
  }

  return ( 
    <div>
      <FindReplaceIcon variant="outlined" style={{ marginRight: '25px' }} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <TextField
            id='name-feedback-form'
            type='given-name'
            label='Search'
            autoComplete='name'
            variant='outlined'
            defaultValue={searchText}
            onChange={onHandleSearchText}
            // onKeyDown={onKeyDown} 
          />
          <ChevronRightIcon style={{ margin: '8px',marginTop:'18px' }} />
          <TextField
            id='name-feedback-form'
            type='given-name'
            label='Replace'
            autoComplete='name'
            // defaultValue={state.name}
            variant='outlined'
            onChange={(e) => { setReplaceText(e.target.value) }}
          // classes={{ root: classes.textField }}
          />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <h4>{_groups?.length}</h4>
            </Grid>
            <Grid item xs={4}>
              <Checkbox onChange={handleSelectAll} checked={selectAll} />
            </Grid>
          </Grid>
          {_groups !== '' ? _groups?.map((value, index) => (
            <ListItemButton key={index}>
              <Tooltip title="Replace">
                {/* <Checkbox checked={valueIndecies.includes(index)} onChange={()=>{handleChange(value, index)}} /> */}
                <Checkbox value={index} checked={checked.includes(index.toString())} onChange={handleChange} />
              </Tooltip>
              <ListItem disablePadding>
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[searchText]}
                  autoEscape={true}
                  textToHighlight={Object.values(value)[0]} //'The they there'
                // caseSensitive={true}
                >
                </Highlighter>
              </ListItem>
            </ListItemButton>
          )) : ''}
        </DialogContent>
        <DialogActions>
          <Button onClick={null}>Replace</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

SearchAndReplace.propTypes = {
  results: PropTypes.array,
  groups: PropTypes.array,
  target: PropTypes.string, //initial string on the search box
  replacement: PropTypes.string, //initial string on the replace box
  onSearch: PropTypes.func,
  onClickGroup: PropTypes.func,
  onClickResult: PropTypes.func,
  onReplaceAll: PropTypes.func,
  onReplaceGroup: PropTypes.func,
  onReplaceResult: PropTypes.func
};