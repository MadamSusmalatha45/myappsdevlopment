import React, { useRef, useState , useEffect} from "react";
import { TextField, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';



export const BasicTimePicker = (props) => {
  
  const [startTime, setStartTime] = useState(new Date());
  const [timeOpen, setTimeOpen] = useState(false);
  const [value, setValue] = useState(props.value);
  const [shortValue, setShortValue] = useState(props.shortValue)
  const handleChangeTime = (newtime) => {
    setStartTime(newtime);
  };
  const anchorRef = useRef();
  const textRef = useRef();
  const rootRef = useRef()
  const [anchorEl, setAnchorEl] = React.useState()
  const [textEl, setTextEl] = React.useState()
  useEffect(() => { 
    setTimeout(() => {
      setAnchorEl(anchorRef?.current)
      setTextEl(textRef?.current)
    }, 1) 
  },  [anchorRef,textRef])

  const onAccept = (currTime) => {
    setTimeOpen(false)
    let selectedDate = new Date(currTime);
    let time = formatAMPM(selectedDate);
    props.setTimeOption([time]);
    setShortValue(time)
    props.changeTime(time)
    setTimeOpen(false)
    setValue(currTime)
    props.changeFullTime(currTime);
  };


  const onSubmit = (currTime) => {
    let selectedDate = new Date(currTime);
    let time = formatAMPM(selectedDate);
    props.changeTime(time)
    // setTimeOpen(false)
    props.changeFullTime(currTime);
  };

  const  formatAMPM = (date) =>  {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = (hours.toString().length == 1 ? `0${hours}` : hours ) + ':' + (minutes.toString().length == 1 ? `0${minutes}B` : minutes)  + ampm;
    return strTime;
  }
  return (
    <Box {...props}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileTimePicker
          PopoverProps={{
            anchorEl: () => rootRef.current
          }}
          autoOk
          label={shortValue === '' ? "HH : MM" : shortValue}
          open={timeOpen}
          onChange={handleChangeTime}
          // onClick={() => {}}
          onAccept={onAccept}
          variant="inline"
          // value={value}
          renderInput={(params) => (
            <TextField
              {...params}
             
              sx={{
                label: {
                  color: "#43515D",
                  fontSize: "25px",
                  textAlign: "center",
                  border: "0.1px solid rgb(0,0,0,0.4)",
                  mt: "20px",
                  fontWeight: "bold",
                  px: "10px",
                  py: "20px",
                  width: "100%",
                  cursor: "pointer",
                  backgroundColor: "#F5F7F9",
                  mx: "20px",
                },
                height: "100%",
                width: "100%",
                input: {
                  display: "none",
                },
                " .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            
              onClick={() => setTimeOpen(true)}
              variant={props.variant}
            />
          )}
          value={startTime}
        />
      </LocalizationProvider>
    </Box>
  );
};
