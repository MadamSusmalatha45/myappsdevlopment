import React,{useState} from "react";
import { Box , Grid, Button } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Dropdown from "../../common/Dropdown";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapImg from "../../../assets/images/map.png"

import "./style.css";

export default function CompanyTracker() {

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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const changeSite = (event) => {
    setSelectedSite(event.target.value);
  };

  const changeGuard = (event) => {
    setSelectedGuard(event.target.value);
  };

  const toggleButton = (title) => {
    title === 'live' ? setActiveToggleButton('live') : setActiveToggleButton('history')
  }

  const changeDate = () => {
    setSelectedDate(new Date())
  }

  const changeTime = () => {
    setSelectedTime('12:00')
  }
  


  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Trackers"  />
      <Grid container  className="sort-box" sx={{mx : "0rem",mt: "5rem", pr : "2rem"}} >
            <Grid item xs={3} sx={{mb : "0.2rem"}}>
               <Button variant="outlined" className={activeToggleButton === 'live' ? 'toggle-btn-active' : 'toggle-btn'} onClick={() => toggleButton('live')}>Live Gps Tracking</Button>
            </Grid>
            {/* <Grid item xs={3} sx={{mb : "0.2rem"}}>
               <Button variant="outlined" className={activeToggleButton === 'history' ? 'toggle-button-active' : 'toggle-button'} onClick={() => toggleButton('history')}>Live Gps History</Button>
            </Grid> */}
            <Grid item xs={6} sx={{mb : "0.2rem"}}>
               
            </Grid>


            <Grid item xs={3}>
                <Dropdown label={'Select Guard'} data={guards} selectedItem={selectedGuard} changeItem={changeGuard} />
            </Grid>
            <Grid item xs={3}>
                <Dropdown label={'Select Site'} data={sites} selectedItem={selectedSite} changeItem={changeSite} />
            </Grid>
            <Grid item xs={3}>
               {
                  activeToggleButton === 'history' &&
                  <FormControl sx={{ m: 1, width : "90%" }}>
                    <Select
                        value={selectedDate}
                        onChange={changeDate}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                        >
                        <MenuItem value="">
                        <div className="select-item"><CalendarMonthIcon className="select-icon" />Select Date</div>
                        </MenuItem>
                        <MenuItem value="1">
                           Test
                        </MenuItem>
                        {/* {
                            props.data.map((item, index) => (
                                <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                            ))
                        } */}
                    </Select>
                </FormControl>
               }
            </Grid>
            <Grid item xs={3}>
               {
                  activeToggleButton === 'history' &&
                  <FormControl sx={{ m: 1, width : "90%" }}>
                    <Select
                        value={selectedTime}
                        onChange={changeTime}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{borderRadius : 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor : "#707070", backgroundColor : 'white'}}
                        >
                        <MenuItem value="">
                        <div className="select-item">Select Time</div>
                        </MenuItem>
                        <MenuItem value="1">
                          Test
                        </MenuItem>
                        {/* {
                            props.data.map((item, index) => (
                                <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                            ))
                        } */}
                    </Select>
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


