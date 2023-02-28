import { Button } from "@mui/material";
import React from "react";
import FormControl from '@mui/material/FormControl';
import './style.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// eslint-disable-next-line react/prop-types
function PageTitle({ title, date }) {
  return (
    <FormControl sx={{ m: 1, width : "90%" , backgroundColor : 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius : '10px'}}>
        <Button variant="outlined" style={{textTransform: 'none',display: 'flex',
         justifyContent: 'space-between', padding : '12px 5px', borderRadius : '10px', color : '#202E43', borderColor : '#202E43'}}  >
            <CalendarMonthIcon />{title}
            <ArrowBackIosNewIcon />{date}
            <ArrowForwardIosIcon />
        </Button>       
    </FormControl>
  );
}

export default PageTitle;
