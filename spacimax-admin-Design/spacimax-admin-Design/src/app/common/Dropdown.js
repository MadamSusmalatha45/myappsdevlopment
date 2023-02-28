import React, {useEffect} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select  from '@mui/material/Select';
import "./style.css"

function Dropdown(props) {
    useEffect(() => {
     
    }, [props])
    return (

        <FormControl sx={{ m: 1, width : "90%" }}>
            <Select
                value={props.selectedItem}
                onChange={props.changeItem}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070"}}
                >
                <MenuItem value="">
                <div className="selectitem">{props.label}</div>
                </MenuItem>
                {
                    props.data.map((item, index) => (
                        <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
  }
  
  export default Dropdown;