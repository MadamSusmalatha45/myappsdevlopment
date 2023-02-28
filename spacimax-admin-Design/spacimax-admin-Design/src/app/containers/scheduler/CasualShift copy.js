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

import { makeStyles } from "@mui/styles";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PageTitle from "../../common/PageTitle";
import LocalDateSelector from "../../common/LocalDateSelector";
import InputLabel from '@mui/material/InputLabel';
import { formSubmitPost, getAPI, postAPI } from "../../network";
import Loader from "../../common/Loader";
import { checkAuthority, formatDatePost, fullName, timeFormat, durationCalc, validation } from "../../utils";
import { duration } from "../../utils/data"
import BasicSelector from "../../common/Selector";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from "@mui/x-date-pickers";
import "./style.css"
import { useNavigate ,useLocation} from 'react-router-dom';

const useStyles = makeStyles(() => ({
  inputRoot: {
    borderRadius: "10px !important",
    backgroundColor: "white",
    padding: "0 5px",
    fontSize:"12px",
    boxShadow:
      "rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px",
    "& .MuiOutlinedInput-input": {
      padding: "14px !important",
    },
  },
  buttoRoot: {
    width: "75px !important",
    borderColor: "#707070 !important;",
    color: "#202E43 !important;",
    borderRadius: "8px !important;",
    fontSize: "16px  !important;",
    textTransform: "none !important;",
    padding: "0px 0px !important;",
    marginRight: "15px !important;",
    "&:hover": {
      backgroundColor: " #42505C !important;",
      color: "white !important",
    },
  },
  buttonRootAlt: {
    borderColor: "#707070 !important;",
    backgroundColor: "#42505C !important",
    color: "white !important;",
    borderRadius: "8px !important;",
    fontSize: "16px  !important;",
    textTransform: "none !important;",
    padding: "0px 30px !important;",
    marginRight: "15px !important;",
  },
}));

export default function CasualShiftsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState({
    shiftStatus: "",
    alarmStatus: "",
  });
  const [client, setClient] = React.useState("");
  const [sites, setSites] = useState([])
  const [loader, setLoader] = useState(false)
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([])
  const [licenseTypes, setLicenseTypes] = useState([])
  const [recurrences, setRecurrences] = useState([])
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [checked, setChecked] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    getShiftTypes();
    getLicenseTypes();
    companyLists()
  }, [])
 

  const [shift, setShift] = useState({
    // role:'',
    assignedUser: task?.assignedUser,
    company: task?.companyId?._id,
    siteId: task?.siteId?._id,
    shiftType: task?.shiftType?._id,
    licenseType: task?.licenseType?._id,
    shiftRecurrence: task?.shiftRecurrence,
    shiftRecurrenceDay: task?.shiftRecurrenceDay,
    duration: '',
    startDate: task?.startDate,
    endDate: task?.endDate,
    startTime:  task?.startTime,
    endTime:  task?.endTime,
    key: task?.key,
    price: task?.price,
    pricein: task?.pricein,
    parking: task?.parkingRequired,
    break: task?.allowedBreaks,
    reportedAt: task?.reportAt,
    woNumber: task?.woNumber,
    roleError: '',
    siteIdError: false,
    assignedUserError: false,
    shiftTypeError: false,
    licenseTypeError: false,
    shiftRecurrenceError: false,
    durationError: false,
    startDateError: false,
    endDateError: false,
    startTimeError: false,
    endTimeError: false,
    keyError: false,
    priceError: false,
    parkingError: false,
    breakError: false,
    reportedAtError: false,
    woNumberError: false
  })
  const getTask=()=>{
    if(location.state.task!= null){
      task = location.state.task
     }
     else if(location.state.task === null){
      console.log("task is")
      task=[{
        assignedUser:'',
        company: '',
        siteId: '',
        shiftType:'',
        licenseType: '',
        shiftRecurrence: '',
        shiftRecurrenceDay: [],
        duration: '',
        startDate: null,
        endDate: null,
        startTime:  null,
        endTime: null,
        key:'',
        price: '',
        pricein:'',
        parking: '',
        break:'',
        reportedAt:'',
        woNumber: '',
      }]
     }
  }
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

  const currencies = [
    {
      label: "AUD",
      value: "aud"
    },
    {
      label: "USD",
      value: "usd"
    },
    {
      label: "EUR",
      value: "eur"
    },
    {
      label: "BTC",
      value: "btc"
    },
    {
      label: "JPY",
      value: "jpy"
    },
    {
      label: "Rs",
      value: "rs"
    }
  ];

  const classes = useStyles();

  

 
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const handleCheck = (event) => {
    var updatedList = [...checked];
    console.log(event.target.checked, "event.target.checked")
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  console.log("Value check",checked)


  // const getDuration=()=>{
  //   return durationCalcu("Duration of time-----------------------",shift.startTime,shift.endTime) 

  // }
  

  // durationCalc(shift.startTime,shift.endTime)



//   function durationCalcu(timestart, timeEnd) {
//     var timeStart = timestart.getTime();
//     var timeEnd = timeEnd.getTime();
//     var hourDiff = timeEnd - timeStart;  
//     var secDiff = hourDiff / 1000; 
//     var minDiff = hourDiff / 60 / 1000;  
//     var hDiff = hourDiff / 3600 / 1000;  
//     var hours = Math.floor(hDiff);
//     var mins = minDiff - 60 * hours;

//     return {
//         hours: hours,
//         mins: mins
//     }
// }

  const getShiftTypes = async () => {
    setLoader(true)
    let data = await getAPI('/shift-types');
    if (data) {
      setShiftTypes(data);
    }
    setLoader(false)
  }
  const getLicenseTypes = async () => {
    setLoader(true)
    let data = await getAPI('/getlicense');
    if (data) {
      setLicenseTypes(data);
    }
    setLoader(false)
  }
  const companyLists = async () => {
    let process = await getAPI('/companies');
    if (process) {
      var companies = [];
      for (var i = 0; i < process.length; i++) {
        companies.push({ label: process[i].name, id: process[i].id })
      }
      setCompanies(companies);
    }
  }

  const getSite = async (idd) => {
    setLoader(true)
    let userType = localStorage.getItem('userType')
    let data = await getAPI(userType === 'admin' ? `/company-sites/${idd}` : '/company/sites');
    if (data) {
      setSites(data);
    }
    setLoader(false)
  } 
  const getUser = async (idd) => {
    setLoader(true)
    let data = await getAPI(`/sites-user/${idd}`);
    if (data) {
      setUsers(data);
    }
    setLoader(false)
  } 
  


  const onChange = (event) => {
    if (event.target.name === "client") {
      setClient(event.target.value);
    } else
      setSelectedStatus({
        [event.target.name]: event.target.value,
        ...selectedStatus,
      });
  };

  const clientLists = [
    {
      id: 1,
      name: "John Doe",
    },
    {
      id: 2,
      name: "Alice Bob",
    },
  ];


  const onChangeSite = async(event) => {
    
    setShift(prevState => ({
      ...prevState,
      siteId: event.target.value,
    }))
    getUser(event.target.value)
  
  }

  const onUserChange = (event) => {
    setShift(prevState => ({
      ...prevState,
      assignedUser: event.target.value,
    }))
   
  }
  const onRoleChange = (event) => {

    setShift(prevState => ({
      ...prevState,
      role: event.target.value,
    }))
  }
  const onCompanyChange = async (event) => {

    setShift(prevState => ({
      ...prevState,
      company: event.target.value,
     
    }))
   
   
    getSite(event.target.value)
    
  }

  const onChangeShiftType = (event) => {
    setShift(prevState => ({
      ...prevState,
      shiftType: event.target.value,
    }))
  }
  const onChangeLicenseType = (event) => {
    setShift(prevState => ({
      ...prevState,
      licenseType: event.target.value,
    }))
  }

  const onChangeRecurrenceType = (event) => {
    setShift(prevState => ({
      ...prevState,
      shiftRecurrence: event.target.value,
    }))
  }

  const onChangeDuration = (event) => {
    setShift(prevState => ({
      ...prevState,
      duration: event.target.value,
    }))
  }

  let checkedval = []
  if (checked.length > 0) {
    for (let i = 0; i < checked.length; i++) {
      checkedval.push(parseInt(checked[i]))
    }
  } else {
    for (let i = 0; i <= 6; i++) {
      checkedval.push(parseInt(i))
    }
  }

  const submitShift = async () => {
    setShift(prevState => ({
      ...prevState,
      siteIdError: false,
      assignedUserError: false,
      shiftTypeError: false,
      shiftRecurrenceError: false,
      durationError: false,
      startDateError: false,
      endDateError: false,
      startTimeError: false,
      licenseTypeError:false,
      endTimeError: false,
      keyError: false,
      priceError: false,
      parkingError: false,
      breakError: false,
      reportedAtError: false,
      woNumberError: false,
    }))
    // if(validation('long', 'Key Shift Duties', shift.key)){
    //   setShift(prevState => ({
    //     ...prevState,
    //     keyError: true
    //   }))
    //   return;
    // }
    // if (validation('empty', 'Site', shift.siteId)) {
    //   setShift(prevState => ({
    //     ...prevState,
    //     siteIdError: true
    //   }))
    //   return;
    // }
    if (validation('empty', 'Work Order Number', shift.woNumber)) {
      setShift(prevState => ({
        ...prevState,
        woNumberError: true
      }))
      return;
    }
    else if (validation('empty', 'Allow Break', shift.break)) {
      setShift(prevState => ({
        ...prevState,
        breakError: true
      }))
      return;
    }
    else if (validation('empty', 'Rate', shift.price)) {
      setShift(prevState => ({
        ...prevState,
        priceError: true
      }))
      return;
    }
    else if (validation('boolean', 'Parking', shift.parking)) {
      setShift(prevState => ({
        ...prevState,
        parkingError: true
      }))
      return;
    }
    else if (validation('empty', 'Shift Type', shift.shiftType)) {
      setShift(prevState => ({
        ...prevState,
        shiftTypeError: true
      }))
      return;
    }
    else if (validation('time', 'Start Time', startTime)) {
      setShift(prevState => ({
        ...prevState,
        startTimeError: true
      }))
      return;
    }
    else if (validation('time', 'End Time', endTime)) {
      setShift(prevState => ({
        ...prevState,
        endTimeError: true
      }))
      return;
    }
    else if (validation('empty', 'Duration', shift.duration)) {
      setShift(prevState => ({
        ...prevState,
        durationError: false
      }))
      return;
    }
    else if (validation('empty', 'Shift Recurrence', shift.shiftRecurrence)) {
      setShift(prevState => ({
        ...prevState,
        shiftRecurrenceError: false
      }))
      return;
    }
    else if (validation('date', 'Start Date', shift.startDate)) {
      setShift(prevState => ({
        ...prevState,
        startDateError: false
      }))
      return;
    }
    else if (validation('date', 'End Date', shift.endDate)) {
      setShift(prevState => ({
        ...prevState,
        endDateError: false
      }))
      return;
    }

    let payload = {
      // role:shift.role,
      assignedUser: shift.assignedUser,
      companyId: shift.company,
      woNumber: parseInt(shift.woNumber),
      siteId: shift.siteId,
      shiftType: shift.shiftType,
      licenseType: shift.licenseType,
      shiftRecurrence: "Weekly",
      pricein:shift.pricein,
      duration: shift.duration,
      startDate: formatDatePost(shift.startDate),
      endDate: formatDatePost(shift.endDate),
      startTime: timeFormat(startTime),
      endTime: timeFormat(endTime),
      key: shift.key,
      price: parseInt(shift.price),
      reportedAt: shift.reportedAt,
      allowedBreaks: shift.break !== '' ? parseInt(shift.break) : '',
      recurrenceDay:checkedval

    };

    setLoader(true)
    let data = await postAPI('/company/shifts/', payload);

    if (data) {

      setShift({
        siteId: '',
        assignedUser: '',
        shiftType: '',
        licenseType: '',
        shiftRecurrence: null,
        shiftRecurrenceDay: [],
        checkedval : [],
        duration: '',
        pricein:'',
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        key: '',
        price: '',
        reportedAt: '',
        woNumber: '',
        break: '',
        siteIdError: false,
        assignedUserError: false,
        shiftTypeError: false,
        licenseTypeError:false,
        shiftRecurrence: false,
        durationError: false,
        startDateError: false,
        endDateError: false,
        startTimeError: false,
        endTimeError: false,
        keyError: false,
        priceError: false,
        reportedAtError: false,
        woNumberError: false,
        breakError: false,
      })
    }
    setLoader(false)
  }

  return (
    <Box sx={{ minHeight: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Scheduler" subTitle="Casual Shifts" />
      {
        checkAuthority('CREATE_CASUAL_SHIFT') &&
        <Box ml={4}>
          <Box>
            {/* <FormControl sx={{ my: 1, minWidth: "20%",marginLeft:"3rem" }}>
              <InputLabel  id="shiftType-label">Select Role</InputLabel>
              <Select
                onChange={onUserChange}
                displayEmpty
                labelId="client-label"
                id="client"
                label="role"
                error={shift.roleError}
                value={shift.role}
                // inputProps={{ "aria-label": "Without label" }}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#707070",
                  pl: 2,
                }}
              >
               
                {roles.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            {/* <FormControl sx={{ my: 1, minWidth: "20%",marginLeft:"3rem" }}>
              <InputLabel id="role-label">Select Role</InputLabel>
              <Select
                error={shift.roleError}
                value={shift.role}
                onChange={onRoleChange}
                displayEmpty
                labelId="role-label"
                id="role"
                label="role"
                
                sx={{
                  borderRadius: "10px",
                  borderColor: "#707070",
                  pl: 2,
                }}
              >
               

               {roles.map((item, index) => (
                  <MenuItem className="select_item" value={item.id} key={index}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <FormControl sx={{ my: 1, minWidth: "20%", marginLeft: "3rem" }}>
              {/* <InputLabel id="company-label">Select Company</InputLabel> */}
              <TextField
                select
                value={shift.company}
                onChange={onCompanyChange}
                displayEmpty
                labelId="company-label"
                id="company"
                label="Select Company"
                error={shift.companyError}
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                  },
                }}
              >

                {
                  companies.map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      <div className="select_item" value={item.id}>{item?.label}</div>
                    </MenuItem>
                  ))
                }
              </TextField>
            </FormControl>

            <FormControl  sx={{ my: 1, minWidth: "20%", marginLeft: "3rem" }}>
            
              <TextField
                select
                value={shift.siteId}
                onChange={onChangeSite}
                label="Site"
                error={shift.parkingError}
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                  },
                }}
              >
                {
                  sites.map((item, index) => (
                    <MenuItem value={item._id} key={index}>
                      <div className="select_item">{item.name}</div>
                    </MenuItem>
                  ))
                }

              </TextField>
            </FormControl>

            <FormControl sx={{ my: 1, minWidth: "20%", marginLeft: "3rem" }}>
           
              <TextField
                select
                value={shift.assignedUser}
                onChange={onUserChange}
                displayEmpty
                label="User"
                error={shift.shiftTypeError}
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                  },
                }}
              >

                
                {
                  users.map((item, index) => (
                    <MenuItem value={item._id} key={index}>
                      <div className="select_item" value={item._id}>{fullName(item)}</div>
                    </MenuItem>
                  ))
                }
              </TextField>
            </FormControl>

            
            {/* <FormControl sx={{ my: 1, minWidth: "20%" ,marginLeft:"3rem"}}>
              <InputLabel id="company-label">Select Company</InputLabel>
              <Select
                value={shift.company}
                onChange={onCompanyChange}
                displayEmpty
                labelId="company-label"
                id="company"
                label="company"
                error={shift.companyError}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#707070",
                  pl: 2,
                }}
              >
               

                {
                  companies.map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      <div className="select_item" value={item.value}>{item?.label}</div>
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl> */}
            {/* <FormControl sx={{ my: 1, minWidth: "20%" }}>
              <InputLabel id="shiftType-label">Select Site</InputLabel>
              <Select
                value={shift.site}
                onChange={onUserChange}
                displayEmpty
                labelId="shiftType-label"
                id="shiftType"
                label="Site"
                error={shift.siteError}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#707070",
                  pl: 2,
                }}
              >

                {
                  users.map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      <div className="select_item" value={item.id}>{fullName(item)}</div>
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl> */}

            <Box my={5} />
            <Grid container m={1} py={5}>
              <Grid item xs={11}>
                <Paper elevation={3}>
                  <Grid container p={5} spacing={5}>
                    <Grid item md={10} lg={8} className="box">
                      <Paper elevation={3} p={3}>
                        <Box p={3}>
                          <Typography
                            sx={{ mt: 1, mb: 2 }}
                            variant="h6"
                            component="div"
                          >
                            Key Shift Duties
                          </Typography>
                          <TextareaAutosize
                            maxRows={100}
                            aria-label="Key Shift Duties"
                            placeholder="Key Shift Duties"
                            minRows={15}
                            defaultValue={shift.key}
                            onChange={(event) => {
                              setShift(prevState => ({
                                ...prevState,
                                key: event.target.value
                              }))
                            }}
                            style={{ width: '100%', fontSize: 16, padding: 10, fontFamily: "Roboto,Helvetica,Arial" }}
                            error={shift.keyError}
                            fullWidth
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item md={10} lg={4} className="align">
                      
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                              WO. Number :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                            <TextField
                              type="number"
                              fullWidth
                              error={shift.woNumberError}
                              value={shift.woNumber}
                              onChange={(event) => {
                                setShift(prevState => ({
                                  ...prevState,
                                  woNumber: event.target.value
                                }))
                              }}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                },
                              }}
                              placeholder=" Reported At"
                            />
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" ,flexDirection:"row"}}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                             Gross Hourly Rate :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                          <div style={{ display: "flex" ,flexDirection:"row"}}>
                          <TextField
                              style={{width:'46%',margin:"1px"}}
                              id="standard-select-currency"
                              select
                              label="Currency"
                              InputLabelProps={{ shrink: true }}
                              margin="normal"
                              value={shift.pricein}
                              onChange={(event) => {
                                setShift(prevState => ({
                                  ...prevState,
                                  pricein: event.target.value
                                }))
                              }}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                },
                              }}
                            >
                              {currencies.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                            style={{width:"50%",marginLeft:'3px'}}
                              type="number"
                              label="Rate"
                              error={shift.priceError}
                              value={shift.price}
                              onChange={(event) => {
                                setShift(prevState => ({
                                  ...prevState,
                                  price: event.target.value
                                }))
                              }}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                },
                              }}
                             
                            />
                          </div>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                              Allow Break :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                            <TextField
                              type="number"
                              fullWidth
                              error={shift.breakError}
                              value={shift.break}
                              onChange={(event) => {
                                setShift(prevState => ({
                                  ...prevState,
                                  break: event.target.value
                                }))
                              }}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                },
                              }}
                              placeholder=" Break in minutes"
                            />
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                              Reported At :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                            <TextField
                              type="text"
                              fullWidth
                              error={shift.reportedAtError}
                              value={shift.reportedAt}
                              onChange={(event) => {
                                setShift(prevState => ({
                                  ...prevState,
                                  reportedAt: event.target.value
                                }))
                              }}
                              InputProps={{
                                classes: {
                                  root: classes.inputRoot,
                                },
                              }}
                              placeholder=" Reported At"
                            />
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                              Parking :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <InputLabel id="parking-label">Parking</InputLabel>
                              <Select
                              
                                value={shift.parking}
                                onChange={(event) => {
                                  setShift(prevState => ({
                                    ...prevState,
                                    parking: event.target.value
                                  }))
                                }}

                                displayEmpty
                                labelId="parking-label"
                                id="parking"
                                label="Parking"
                                error={shift.parkingError}
                                sx={{
                                  borderRadius: "10px",
                                  borderColor: "#707070",
                                  pl: 2,
                                }}
                              >
                                <MenuItem value={true}>
                                  <div className="select_item">Yes</div>
                                </MenuItem>
                                <MenuItem value={false}>
                                  <div className="select_item">No</div>
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                              License Type :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <InputLabel id="shiftType-label">License Type</InputLabel>
                              <Select
                                value={shift.licenseType}
                                onChange={onChangeLicenseType}
                                displayEmpty
                                labelId="shiftType-label"
                                id="shiftType"
                                label="License Type"
                                error={shift.licenseTypeError}
                                sx={{
                                  borderRadius: "10px",
                                  borderColor: "#707070",
                                  pl: 2,
                                }}
                              >
                               
                                {
                                  licenseTypes.map((item, index) => (
                                    <MenuItem value={item._id} key={index}>
                                      <div className="select_item" value={item._id}>{item?.name}</div>
                                    </MenuItem>
                                  ))
                                }
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={5}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h4"
                            >
                              Shift Type :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={7} py={2}>
                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <InputLabel id="shiftType-label">Shift Type</InputLabel>
                              <Select
                                value={shift.shiftType}
                                onChange={onChangeShiftType}
                                displayEmpty
                                labelId="shiftType-label"
                                id="shiftType"
                                label="ShiftType"
                                error={shift.shiftTypeError}
                                sx={{
                                  borderRadius: "10px",
                                  borderColor: "#707070",
                                  pl: 2,
                                }}
                              >

                                {
                                  shiftTypes.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>
                                      <div className="select_item" value={item.id}>{item.name}</div>
                                    </MenuItem>
                                  ))
                                }
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
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
                                  options={false}
                                  value={startTime}
                                  name={"Start Time"}
                                  error={shift.startTimeError}
                                  label="Start Time"
                                  isTimeSelector={true}
                                  onChange={(newValue) => {
                                    setStartTime(newValue)
                                  }}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>

                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  options={false}
                                  value={endTime}
                                  name={"End Time"}
                                  error={shift.startTimeError}
                                  label="End Time"
                                  isTimeSelector={true}
                                  onChange={(newValue) => {
                                    setEndTime(newValue)
                                  }}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>

                            <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <InputLabel id="duration-label">Duration</InputLabel>
                              <Select
                                value={shift.duration}
                                onChange={onChangeDuration}
                                displayEmpty
                                labelId="duration-label"
                                id="duration"
                                label="Duration"
                                error={shift.durationError}
                                sx={{
                                  borderRadius: "10px",
                                  borderColor: "#707070",
                                  pl: 2,
                                }}
                              >
                                {
                                  duration.map((item, index) => (
                                    <MenuItem value={item.value} key={index}>
                                      <div className="select_item">{item.name}</div>
                                    </MenuItem>
                                  ))
                                }
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex" }}>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h3"
                            >
                              Recurrence Patterns :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={{ marginTop: "5rem" }} >

                            <Button variant="outlined" className={'row-btn-alt'}
                            >
                              Weekly
                            </Button>
                            {/* {isShow && */}
                            <Typography>
                              <h4>Please Select Recurrence Day</h4>
                              <Grid className="mt-2 mb-2">
                                <div className="h-10" >
                                  {checkListWeek.map((item, index) => (
                                    <div key={index} style={{ display: "inline" }}>
                                      <input sx={{ fontSize: "12px" }} value={item.val} type="checkbox" onChange={handleCheck}
                                      />
                                      <span className={isChecked(item)} key={item} value={item.val}>{item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </Grid>
                            </Typography>

                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl sx={{ display: "flex", marginTop: '5rem' }}>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <FormLabel
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "black",
                              }}
                              component="h3"
                            >
                              Range of Recurrence :
                            </FormLabel>
                          </Grid>
                          <Grid item xs={12} pb={2}>
                            <FormControl sx={{ mb: 2, width: "315px" }}>
                             
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  label="Start Date"
                                  value={shift.startDate}
                                  error={shift.startDateError}
                                  minDate={new Date()}
                                  // selected={StartValue}
                                  onChange={(date) => {
                                    setShift(prevState => ({
                                      ...prevState,
                                      startDate: date
                                    }))
                                  }}

                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>

                            <FormControl sx={{ mb: 4, width: "315px" }}>

                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  label="End Date"
                                  value={shift.endDate}
                                  error={shift.endDateError}
                                  // selected={StartValue}
                                  onChange={(date) => {
                                    setShift(prevState => ({
                                      ...prevState,
                                      endDate: date
                                    }))
                                  }}

                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </FormControl>
                            {/* <Grid container>
                            <Grid item xs={4} >
                              <Button
                                variant="outlined"
                                className={classes.buttoRoot}
                                sx={{ mr: "0 !important" }}
                              >
                                End by
                              </Button>
                            </Grid>
                            <Grid item xs={4}>
                              <Button
                                variant="outlined"
                                className={classes.buttoRoot}
                                sx={{ mr: "0 !important" }}
                              >
                                End after
                              </Button>
                            </Grid>
                            <Grid item xs={4}>
                              <Button
                                variant="outlined"
                                className={classes.buttoRoot}
                                sx={{
                                  mr: "0 !important",
                                  width:"114px  !important",
                                }}
                              >
                                No end date
                              </Button>
                            </Grid>
                          </Grid> */}
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl
                        sx={{
                          my: 1,
                          minWidth: "100%",
                          display: "flex !important",
                          columnGap: "20px",
                          flexDirection: "row !important",
                          flexWrap: "wrap !important",
                          justifyContent: "center",
                        }}
                      >
                        <Button variant="outlined" className={classes.buttoRoot} onClick={submitShift}>
                          Ok
                        </Button>

                        <Button variant="outlined" className={classes.buttoRoot} onClick={() => navigate(-1)}>

                          Cancel
                        </Button>
                      </FormControl>

                      {/* <FormControl sx={{ display: "flex" }}>
                      <Grid container alignItems="center">
                        <Grid item xs={5}>
                          <FormLabel
                            style={{
                              fontWeight: "bolder",
                              fontSize: "larger",
                              color: "black",
                            }}
                            component="h4"
                          >
                            Total Shifts :
                          </FormLabel>
                        </Grid>
                        <Grid item xs={3} py={2}>
                          <Paper
                            elevation={3}
                            sx={{ p: 1.4, textAlign: "center" }}
                          >
                            5
                          </Paper>
                        </Grid>
                      </Grid>
                    </FormControl> */}

                      {/* <FormControl sx={{ display: "flex" }}>
                      <Grid container alignItems="center">
                        <Grid item xs={5}>
                          <FormLabel
                            style={{
                              fontWeight: "bolder",
                              fontSize: "larger",
                              color: "black",
                            }}
                            component="h4"
                          >
                            Allow Breaks :
                          </FormLabel>
                        </Grid>
                        <Grid item xs={3} py={2}>
                          <TextField 
                            type="number"
                            value={shift.break}
                            error={shift.breakError}
                            onChange={(event) => {
                              setShift(prevState => ({
                                ...prevState,
                                break: event.target.value
                              }))
                            }}
                          />
                        </Grid>
                      </Grid>
                    </FormControl> */}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              {/* <Grid item xs={6} mt={5} alignSelf="center">
              <Button
                sx={{
                  float: "right",
                  mt: 2,
                  backgroundColor: "#42505C",
                  color: "white",
                  borderRadius: "10px",
                  px: 5,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#343636",
                  },
                }}
                type="submit"
                variant="contained"
              >
                Advertise Shift
              </Button>
            </Grid> */}
            </Grid>
          </Box>
        </Box>
      }
    </Box>
  );
}
