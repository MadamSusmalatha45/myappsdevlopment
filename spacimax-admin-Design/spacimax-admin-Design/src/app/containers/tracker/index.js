import React,{useState} from "react";
import { Box , Grid, Button } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Dropdown from "../../common/Dropdown";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapImg from "../../../assets/images/map.png"
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import "./style.css";

export default function TrackerPage() {

  const sites = [
    {id : 1, name : '111,ABC Street,Sydney'},
    {id : 2, name : '112,ABC Street,Sydney'},
    {id : 3, name : '113,ABC Street,Sydney'},
    {id : 4, name : '114,ABC Street,Sydney'},
    {id : 5, name : '115,ABC Street,Sydney'},
  ]

  const guards = [
    {id : 1, name : 'Pan Singh Tomar'},
    {id : 2, name : 'Rajiv Kumar'},
    {id : 3, name : 'Santosh Rastogi'},
    {id : 4, name : 'Brijesh Pandey'},
    {id : 5, name : 'Atul Bihari'},
  ]

 

  const [selectedSite, setSelectedSite] = React.useState('');
  const [selectedGuard, setSelectedGuard] = React.useState('');
  const [activeToggleButton, setActiveToggleButton] = useState('live');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const changeSite = (event) => {
    setSelectedSite(event.target.value);
  };

  const changeGuard = (event) => {
    setSelectedGuard(event.target.value);
  };

  const toggleButton = (title) => {
    title === 'live' ? setActiveToggleButton('live') : setActiveToggleButton('history')
  }

  const changeDate = (e) => {
    console.log('DATE',e)
    setSelectedDate(e)
  }

  const changeTime = (e) => {
    console.log('Time',e)
    setSelectedTime(e)
  }
  


  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Trackers"  />
      <Grid container  className="sort-box" sx={{mx : "0rem",mt: "5rem", pr : "2rem"}} >
            <Grid item xs={3} sx={{mb : "0.2rem"}}>
               <Button variant="outlined" className={activeToggleButton === 'live' ? 'toggle-btn-active' : 'toggle-btn'} onClick={() => toggleButton('live')}>Live Gps Tracking</Button>
            </Grid>
            {/* <Grid item xs={3} sx={{mb : "0.2rem"}}>
               <Button variant="outlined" className={activeToggleButton === 'history' ? 'toggle-btn-active' : 'toggle-btn'} onClick={() => toggleButton('history')}>Live Gps History</Button>
            </Grid> */}
            <Grid item xs={6} sx={{mb : "0.2rem"}}>
               
            </Grid>


            <Grid item xs={3}>
                <Dropdown  label={'Select Guard'} data={guards} selectedItem={selectedGuard} changeItem={changeGuard} />
            </Grid>
            <Grid item xs={3}>
                <Dropdown label={'Select Site'} data={sites} selectedItem={selectedSite} changeItem={changeSite} />
            </Grid>
            <Grid item xs={3}>
               {
                  activeToggleButton === 'history' &&
                  <FormControl sx={{ m: 1, width : "90%" }}>
                    {/* <Select
                        value={selectedDate}
                        onChange={changeDate}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                        >
                        <MenuItem value="">
                        <div className="selectitem"><CalendarMonthIcon className="select-icon" />Select Date</div>
                        </MenuItem>
                        <MenuItem value="1">
                           Test
                        </MenuItem>
                    
                    </Select> */}
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DesktopDatePicker
                        label="Select Date"
                        inputFormat="MM/DD/YYYY"
                        value={selectedDate}
                        onChange={changeDate}
                        renderInput={(params) => <TextField {...params} />}
                        style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                      />
                    </LocalizationProvider>
                </FormControl>

                  
               }
            </Grid>
            <Grid item xs={3}>
               {
                  activeToggleButton === 'history' &&
                  <FormControl sx={{ m: 1, width : "90%" }}>
                    {/* <Select
                        value={selectedTime}
                        onChange={changeTime}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                        >
                        <MenuItem value="">
                        <div className="selectitem">Select Time</div>
                        </MenuItem>
                        <MenuItem value="1">
                          Test
                        </MenuItem>
                    </Select> */}

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                     <TimePicker
                      label="Start Time"
                      value={selectedTime}
                      onChange={changeTime}
                      renderInput={(params) => <TextField {...params} />}
                      style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                     />
                    </LocalizationProvider>
                 </FormControl>
               }
            </Grid>
      </Grid>
      <Box display="flex" sx={{ mx : "0.4rem" , mt: "2rem" }}  className="map-container">
        <img src={MapImg} className="map-img" />
      </Box>
      <div style={{height : 50}}></div>
    </Box>
  );
}


