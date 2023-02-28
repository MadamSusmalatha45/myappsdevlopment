import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Paper,
  List,
  Typography,
  ListItem,
  ListItemText,
  FormLabel,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { getRoles, getSiteTeam } from "../../../../../features/sites/sitesAPI";
import PageTitle from "../../../../common/PageTitle.js";
import LocalDateSelector from "../../../../common/LocalDateSelector";
// import { useParams } from "react-router-dom";
import { selectRoles, selectSiteTeams } from "../../../../../features/sites/sitesSlice";
import { addRoasters } from "../../../../../features/roster/roasterAPI";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { roundToNearestMinutes } from "date-fns";
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../../../constant";
import { useNavigate } from 'react-router-dom';
import './style.css'
import { checkAuthority } from "../../../../utils";
const userToken = localStorage.getItem("token");


const useStyles = makeStyles(() => ({
  inputRoot: {
    borderRadius: "10px !important",
    backgroundColor: "white",
    padding: "0 5px",
    boxShadow:
      "rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px",
    "& .MuiOutlinedInput-input": {
      padding: "14px !important",
    },
  },
  buttoRoot: {
    borderColor: "#707070 !important;",
    color: "#202E43 !important;",
    borderRadius: "8px !important;",
    fontSize: "16px  !important;",
    textTransform: "none !important;",
    padding: "0px 30px !important;",
    margin: "5px !important",
    marginRight: "15px !important;",
    "&:hover": {
      backgroundColor: " #42505C !important;",
      color: "white !important",

    },
  },
}));

export default function CreateRoasterPage() {
  const { data, loading, error } = useSelector(selectRoles);
  const dispatch = useDispatch();
  const [StartValue, setStartValue] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const siteId = window.location.pathname.split('/')[2];
  const [key, setKey] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({
    shiftStatus: "",
    alarmStatus: "",
  });
  const [userError, setUserError] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [WeekShow, setWeekshow] = useState(true);

  const [week, setWeek] = useState(false);
  const [checked, setChecked] = useState([]);
  const navigate = useNavigate();
  const checkListWeek = [{
    "name": "Mon",
    val: 0
  },
  {
    "name": "Tue",
    val: 1
  },
  {
    "name": "Wed",
    val: 2
  },
  {
    "name": "Thus",
    val: 3
  },
  {
    "name": "Fri",
    val: 4
  },
  {
    "name": "Sat",
    val: 5
  },
  {
    "name": "Sun",
    val: 6
  }];
  const toastObj = { position: toast.POSITION.TOP_CENTER };
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
    },
  });
  const [client, setClient] = useState("");
  const [id, setId] = useState("");


  useEffect(() => {
    const myId = window.location.pathname.split("/")[2];
    setId(myId)
    dispatch(getRoles({ id: myId }));
  }, []);



  const handleCheck = (event) => {
    var updatedList = [...checked];
    // console.log("DAysssss",event.target.value)
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };
  var clearAll = {
    siteId: '',
    role: '',
    key: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    recurrenceType: "",
    recurrenceDay: null
  };

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const classes = useStyles();
  const onChange = (event) => {
    if (event.target.name === "client") {
      setClient(event.target.value);
    } else
      setSelectedStatus({
        [event.target.name]: event.target.value,
        ...selectedStatus,
      });
  };



  // const adjustDate = (obj) => {
  //   var newDate = obj.toDate();
  //   return newDate.getFullYear() + '-' + (newDate.getMonth().toString().length == 1 ? `0${newDate.getMonth()}` : newDate.getMonth()) + '-' +
  //          (newDate.getDate().toString().length === 1 ? `0${newDate.getDate()}` : newDate.getDate());
  // }
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  const onSubmit = async (data) => {
    setUserError(false);
    setKeyError(false);
    setStartDateError(false);
    setEndDateError(false);
    setStartTimeError(false);
    setEndTimeError(false);



    if (client === '') {
      toast.warning('Please select user', toastObj);
      setUserError(true);
      return false;
    }
    else if (key === '' || key.length < 10) {
      toast.warning('Shift key description is required and at least 10 character long', toastObj);
      setKeyError(true);
      return false;
    }

    else if (startTime === '' || startTime === null) {
      toast.warning('Start time is required!', toastObj);
      setStartTimeError(true);
      return false;
    }
    else if (endTime === '' || endTime === null) {
      toast.warning('End time is required!', toastObj);
      setEndTimeError(true);
      return false;
    }

    else if (StartValue === '' || StartValue === null) {
      toast.warning('Start date is required!', toastObj);
      setStartDateError(true);
      return false;
    }
    else if (endValue === '' || endValue === null) {
      toast.warning('End date is required!', toastObj);
      setEndDateError(true);
      return false;
    }


    let checkedval=[]
    if(checked.length>0){
      for(let i=0; i<checked.length;i++){
        checkedval.push(parseInt(checked[i]))
      }
    }else{
      for(let i=0; i<=6;i++){
        checkedval.push(parseInt(i))
      }
    }

    var payload = {
      siteId: id,
      role: client,
      key: key,
      startDate: convert(StartValue),
      endDate: convert(endValue),
      startTime: startTime.format("hh:mmA"),
      endTime: endTime.format("hh:mmA"),
      recurrenceType: "Weekly",
      recurrenceDay: checkedval
    };



    // return;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(payload)
    };


    var result = await fetch(BASE_URL + "/company/roster", requestOptions)
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (res.code === 201 || res.code === 200) {
          clearAll()
          toast.success(res.message, toastObj);
          setClient('');
          setKey('');
          checkListWeek([]);
          setStartTime(null);
          setEndTime(null);
          setStartValue(null);
          setEndValue(null);
          
        }
        else {
          toast.error(res.message, toastObj);
        }
      })

  };
  const RED = 'red';

  const setweekly = () => {
    setWeek(current3 => !current3);
    setWeekshow((WeekShow => !WeekShow));

  }

  return (
    <Box sx={{ minHeight: "inherit" }}>
      <PageTitle title="Scheduler" subTitle="Create Roasters" />
      {
        checkAuthority('ADD_FIXED_ROASTER') &&
        <Box ml={4}>
          <Box>
            <FormControl sx={{ m: 1, minWidth: "25%" }}>
              <Select
                value={client}
                onChange={onChange}
                displayEmpty
                name="client"
                inputProps={{ "aria-label": "Without label" }}
                sx={{
                  borderRadius: "8px",
                  boxShadow: (userError ? RED : "rgba(0, 0, 0, 0.24)") + " 0px 3px 8px",
                  borderColor: "#707070",
                  pl: 2,
                }}
              >
                <MenuItem value="">

                  <div className="selectitem">Select Role</div>

                </MenuItem>
                {data.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box my={5} />
            <Grid container m={1} py={5}>
              <Grid item xs={11}>
                <Paper elevation={3}>
                  <Grid container p={5} spacing={5}>
                    <Grid item md={10} lg={8}>
                      <Paper elevation={3} p={3}>
                        <Box p={3}>
                          <Typography
                            sx={{ mt: 1, mb: 2 }}
                            variant="h6"
                            component="div"
                          >
                            Key Shift Duties
                          </Typography>
                          {/* <List
                          dense={true}
                          sx={{ listStyle: "disc" }}
                          component="ul"
                        >
                          {shiftDuties.map((duty, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText
                                sx={{
                                  display: "list-item",
                                  textAlign: "-webkit-match-parent",
                                }}
                                primary={duty}
                              />
                            </ListItem>
                          ))}
                        </List> */}
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={6}
                            placeholder="Shift key description"
                            defaultValue={key}
                            style={{ width: '70%', fontFamily: "Roboto,Helvetica,Arial,sans-serif", fontSize: 17, padding: 10, border: keyError ? '1px solid ' + RED : '1px solid gray' }}
                            onChange={(e) => setKey(e.target.value)}
                          />

                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item md={10} lg={4}>


                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <FormLabel
                              style={{
                                fontWeight: 500,
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h3"
                            >
                              Appointment Recurrence :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} pb={2}>
                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  className={startTimeError ? "timePicker" : null}
                                  label="Start Time"
                                  value={startTime}
                                  onChange={(newValue) => {
                                    setStartTime(newValue);
                                  }}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>

                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  className={endTimeError ? "timePicker" : null}
                                  label="Finish Time"
                                  value={endTime}
                                  onChange={(newValue) => {
                                    setEndTime(newValue);
                                  }}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>

                          </Grid>


                        </Grid>
                      </FormControl>

                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <FormLabel
                              style={{
                                fontWeight: 500,
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h3"
                            >
                              Range of Recurrence :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={12} pb={2}>
                            <FormControl sx={{ mb: 2 }}>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  className={startDateError ? "timePicker" : null}
                                  label="Start Date"
                                  value={StartValue}
                                  minDate={new Date()}
                                  selected={StartValue}
                                  onChange={(newValue) => {
                                    setStartValue(newValue);
                                  }}
                                  
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>

                            <Grid container>
                              <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    className={endDateError ? "timePicker" : null}
                                    label="Finish Date"
                                    value={endValue}
                                    selected={endValue}
                                    onChange={(newValue) => {
                                      setEndValue(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl style={{ marginTop: "5rem" }}>
                        <Grid alignItems="center">

                          <Button variant="outlined" style={{
                            backgroundColor: week ? '#42505C' : '',
                            color: week ? 'white' : '',
                          }} onClick={(e) => {
                            setweekly()
                          }} >
                            Weekly
                          </Button>
                          <div>
                            {/* {WeekShow && */}

                            <Typography>
                              <h4>Please Select weekly Recurrence Day</h4>
                              <Grid className="mt-2 mb-2">
                                  <div className="h-10" >
                                    {console.log("checkList==========",checkListWeek)}
                                    { checkListWeek.map((item, index) => (
                                      <div key={index}  style={{ display: "inline" }}>
                                        <input sx={{ fontSize: "12px" }} value={item.val} type="checkbox" onChange={handleCheck}
                                        />
                                        <span className={isChecked(item)} key={item} value={item.val}>{item.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </Grid>
                            </Typography>
                            {/* // } */}


                          </div>
                        </Grid>
                      </FormControl>
                      <FormControl
                        sx={{
                          my: 1,
                          minWidth: "100%",
                          display: "flex !important",
                          columnGap: "18px",
                          display: "-webkit-box!important",
                          flexWrap: "wrap !important",
                          justifyContent: "center",
                          marginTop: "5rem"
                        }}
                      >
                        <Button variant="outlined" onClick={handleSubmit(onSubmit)} className={classes.buttoRoot}>
                          Ok
                        </Button>
                        <Button variant="outlined" className={classes.buttoRoot} onClick={() => navigate(-1)} >
                          Cancel
                        </Button>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

            </Grid>
          </Box>
        </Box>
      }

    </Box>
  );
}
