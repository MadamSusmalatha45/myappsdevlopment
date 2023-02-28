import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  TableBody,
  Table,
  MenuItem,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Select,
  TableCell,
  FormControl,
  FormLabel,
  Button,
  TextField,
} from "@mui/material";
import PageTitle from "../../common/PageTitle";
import BasicSelector from "../../common/Selector";
import { makeStyles } from "@mui/styles";
import LocalDateSelector from "../../common/LocalDateSelector";
import { duration } from '../../utils/data'
import Loader from "../../common/Loader";
import './style.css'
import { getAPI, postAPI, deleteAPI, putAPI } from "../../network";
import { ScheduleSharp } from "@material-ui/icons";
import { checkAuthority, formatDate, formatDatePost, fullName, timeFormat, uniqueArray, validation, tableHeader, tableData } from "../../utils";
import Checkbox from '@mui/material/Checkbox';

import { TimePicker } from "@mui/x-date-pickers";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from '@mui/material/InputLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate} from "react-router-dom";

import './style.css'
import { toast } from "react-toastify";

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
    padding: "5px 30px !important;",
    marginRight: "15px !important;",
    "&:hover": {
      backgroundColor: " #42505C !important;",
      color: "white !important",
    },
  },
}));

export default function CreateAlarmResponse() {
  const [sites, setSites] = useState([]);
  const [roles, setRoles] = useState([]);
  const [recurrences, setRecurrences] = useState([]);
  const [loader, setLoader] = useState(false)
  const [durations, setDurations] = useState(duration)
  const [allChk, setAllChk] = useState(false)
  const [dataEditId, setDateEditId] = useState(0)
  const [dateType, setDateType] = useState('')
  const [timeOpen, setTimeOpen] = useState(false)
  const [time, setTime] = useState(null)
  const [alarms, setAlarms] = useState([])
  const [startTimee, setStartTime] = useState(null);
  const [endTimee, setEndTime] = useState(null);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const navigate=useNavigate()
  const [scheduler, setScheduler] = useState({
    role: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    shiftRecurrence:'',
    mobileNumber: '',
    duration: '',
    sites:[],
    roleError: false,
    startDateError: false,
    endDateError: false,
    startTimeError: false,
    endTimeError: false,
    shiftRecurrenceError: false,
    mobileNumberError: false,
    durationError: false,
  })
  useEffect(() => {
    getSites();
    getRoles();
    getRecurrences();
    getAlarms()
  }, []);

  const sitedata = sites[0]

  const getAlarms = async () => {
    setLoader(true)
    let data = await getAPI('/alarm');
    if (data) {
      setAlarms(data)
    }
    setLoader(false)
  }


  const getSites = async () => {
    setLoader(true)
    let data = await getAPI('/sites');
    if (data) {
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({ id: data[i]._id, site: data[i].name, startTime: 'HH:MM', startTimeError: false, endTime: 'HH:MM', endTimeError: false, sitesNote: '', checked: false });
      }
      setSites(arr)
    }
    setLoader(false)
  }

  const getRoles = async () => {
    setLoader(true)
    let data = await getAPI('/roles');
    if (data) {
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({ id: data[i].id, name: data[i].name, value: data[i].id, label: data[i].name });
      }
      setRoles(arr)
    }
    setLoader(false)
  }

  const getRecurrences = async () => {
    setLoader(true)
    let data = await getAPI('/recurrence');
    if (data) {
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({ id: data[i].id, name: data[i].name, checked: false });
      }
      setRecurrences(arr)
    }
    setLoader(false)
  }

  const classes = useStyles();

  const handleChkChange = (id) => {
    let data = sites.map((item) => {
      if (item.id === id) {
        return { id: item.id, site: item.site, startTime: item.startTime, startTimeError: item.startTimeError, endTime: item.endTime, endTimeError: item.endTimeError, sitesNote: item.sitesNote, checked: !item.checked }
      }
      else {
        return item;
      }

    })
    setSites(data)

    var allArr = [];

    for (var i = 0; i < sites.length; i++) {
      if (sites[i].checked === false) {
        allArr.push(false)
      }
      else {
        allArr.push(true)
      }
    }

    allArr = uniqueArray(allArr);
    setAllChk(allArr.length === 1 ? false : true)

  }

  const setDynamicTime = (type, id, date) => {
    var data = sites.map((item) => {
      if (id == item.id) {
        return { id: item.id, site: item.site, startTime: (type == 'start' ? timeFormat(date) : item.startTime), startTimeError: item.startTimeError, endTime: (type == 'end' ? timeFormat(date) : item.endTime), endTimeError: item.endTimeError, sitesNote: item.sitesNote, checked: item.checked }
      }
      else {
        return item;
      }
    })

    setSites(data)
  }

  const changeNote = (id, value) => {
    var data = sites.map((item) => {
      if (id == item.id) {
        return { id: item.id, site: item.site, startTime: item.startTime, startTimeError: item.startTimeError, endTime: item.endTime, endTimeError: item.endTimeError, sitesNote: value, checked: item.checked }
      }
      else {
        return item;
      }
    })

    setSites(data)
  }

  const openTimePicker = (type, id) => {
    setDateEditId(id)
    setDateType(type)
    setTimeOpen(true)
  }

  const handleChangeTime = (type, id, data) => {
    setDynamicTime(type, id, data)
    setTime(data)
  }

  const onAccept = (type, id, data) => {
    setDynamicTime(type, id, data)
    setTimeOpen(false)
    setTime(data)
  }
  const createAla = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();

  }

  const handleChkAllChange = () => {
    var newSites = sites.map((item) => {
      return { id: item.id, site: item.site, startDate: item.startDate, startTimeError: item.startTimeError, endDate: item.endDate, endTimeError: item.endTimeError, sitesNote: item.sitesNote, checked: !allChk }
    })
    setAllChk(!allChk)
    setSites(newSites);
  }

  const schedulerSubmit = async () => {
   
    setScheduler(prevState => ({
      ...prevState,
      roleError: false,
      startDateError: false,
      endDateError: false,
      startTimeError: false,
      endTimeError: false,
      shiftRecurrenceError: false,
      mobileNumberError: false,
      durationError: false,
    }))

    // let errErr = []
    // for (var i = 0; i < sites.length; i++) {
    //   errErr.push({ siteId: sites[i].id, startTime: sites[i].startTime, startTimeError: false, endTime: sites[i].endTime, endTimeError: false, notes: sites[i].sitesNote });
    // }
    // setSites(errErr);
    if (validation('empty', 'Role', scheduler.role)) {
      setScheduler(prevState => ({
        ...prevState,
        roleError: true,
      }))
      return;
    }
    else if (validation('phone', 'Mobile Number', scheduler.mobileNumber)) {
      setScheduler(prevState => ({
        ...prevState,
        mobileNumberError: true,
      }))
      return;
    }
    else if (validation(null, 'Shift Recurrence', scheduler.shiftRecurrence)) {
      setScheduler(prevState => ({
        ...prevState,
        shiftRecurrenceError: true,
      }))
      return;
    }
    else if (validation('time', 'Start Time', startTimee)) {
      setScheduler(prevState => ({
        ...prevState,
        startTime: true,
      }))
      return;
    }
    else if (validation('time', 'End Time', endTimee)) {
      setScheduler(prevState => ({
        ...prevState,
        endTime: true,
      }))
      return;
    }
    else if (validation(null, 'Duration', scheduler.duration)) {
      setScheduler(prevState => ({
        ...prevState,
        duration: true,
      }))
      return;
    }
    else if (validation('date', 'Start Date', scheduler.startDate)) {
      setScheduler(prevState => ({
        ...prevState,
        startError: true,
      }))
      return;
    }
    else if (validation('date', 'End Date', scheduler.endDate)) {
      setScheduler(prevState => ({
        ...prevState,
        endDate: true,
      }))
      return;
    }

    var arr = [];
    for (var i = 0; i < sites.length; i++) {

      if (sites[i].checked) {
        if (validation('time', 'Start Time', sites[i].startTime)) {
          let data = sites.map((item) => {
            if (item.id === sites[i].id) {
              return { id: item.id, site: item.site, startTime: item.startTime, startTimeError: true, endTime: item.endTime, endTimeError: item.endTimeError, sitesNote: item.sitesNote, checked: item.checked }
            }
            else {
              return item;
            }
          })
          setSites(data)
          return;
        }
        else if (sites[i].startTime === 'HH:MM') {
          toast.warning('Start Time is required!')
          let data = sites.map((item) => {
            if (item.id === sites[i].id) {
              return { id: item.id, site: item.site, startTime: item.startTime, startTimeError: true, endTime: item.endTime, endTimeError: item.endTimeError, sitesNote: item.sitesNote, checked: item.checked }
            }
            else {
              return item;
            }
          })
          setSites(data)
          return;
        }
        else if (validation('time', 'End Time', sites[i].endTime)) {
          let data = sites.map((item) => {
            if (item.id === sites[i].id) {
              return { id: item.id, site: item.site, startTime: item.startTime, startTimeError: item.startTimeError, endTime: item.endTime, endTimeError: true, sitesNote: item.sitesNote, checked: item.checked }
            }
            else {
              return item;
            }
          })
          setSites(data)
          return;
        }
        else if (sites[i].endTime === 'HH:MM') {
          toast.warning('End Date is required!')
          let data = sites.map((item) => {
            if (item.id === sites[i].id) {
              return { id: item.id, site: item.site, startTime: item.startTime, startTimeError: item.startTimeError, endTime: item.endTime, endTimeError: true, sitesNote: item.sitesNote, checked: item.checked }
            }
            else {
              return item;
            }
          })
          setSites(data)
          return;
        }
        else if (validation('empty', 'Site Note', sites[i].sitesNote)) {
          return;
        }
      }
    }

    let siteArr = []
    for (var i = 0; i < sites.length; i++) {
      if (sites[i].checked === true) {
        siteArr.push({ siteId: sites[i].id, startTime: sites[i].startTime, endTime: sites[i].endTime, notes: sites[i].sitesNote });
      }
    }
    let payload = {
      role: scheduler.role,
      startDate: formatDatePost(scheduler.startDate),
      endDate: formatDatePost(scheduler.endDate),
      startTime: timeFormat(startTimee),
      endTime: timeFormat(endTimee),
      shiftRecurrence: scheduler.shiftRecurrence,
      mobileNumber: scheduler.mobileNumber,
      duration: scheduler.duration,
      sites: siteArr
    }


    if (action === 'edit') {
      setLoader(true)
      let data = await putAPI(`/alarm/${editId}`, payload)
      if (data) {
        getSites();
        getAlarms();
        setOpen(false)
      } else {
        getSites();
      }
      setLoader(false)
    }
    else if(action=='add') {
      setLoader(true)
      let data = await postAPI('/alarm', payload);
      if (data) {
        getSites();
        getRecurrences();
        getRoles();
        getAlarms()
      } else {
        getSites();
      }
      setLoader(false)
    }
     
    
 
  }


  const setRecurrence = (id) => {
    var data = recurrences.map((item) => {
      if (id === item.id) {
        return { id: item.id, name: item.name, checked: true }
      }
      else {
        return { id: item.id, name: item.name, checked: false }
      }
    })
    setRecurrences(data)
    setScheduler(prevState => ({
      ...prevState,
      shiftRecurrence: id,
    }))
  }
  const handleShowClose = () => {
    setShow(false);
  }


  const editClick = async(e, id) => {
    e.preventDefault();
    
    setEditId(id)
   
    let data = alarms.filter(item => item.id === id)[0];
    console.log(data,"Edit click")
    console.log(data.mobileNumber)
    setScheduler(prevState => ({
      ...prevState,
      role: data?.role,
      startDate: formatDatePost(data.startDate),
      endDate: formatDatePost(data.endDate),
      startTime: data?.startTime,
      endTime: data?.endTime,
      sites: data?.sites,
      shiftRecurrence:data?.shiftRecurrence?._id,
      mobileNumber:data.mobileNumber,
      roleError: false,
      startDateError: false,
      endDateError: false,
      startTimeError: false,
      endTimeError: false,
      durationError: false,
    }))
    console.log(scheduler,"------scheduler.....")
    setOpen(true)
    
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteClick = (id) => {
    setEditId(id);
    clearAll();
    setShow(true);
  }
  const handleDelete = async () => {
    console.log("id", editId)
    setLoader(true);
    let process = await deleteAPI(`/alarm/${editId}`)
    // let process = await deleteAPI(`http://localhost:8000/v1/alarm/${editId}`);
    setLoader(false);
    if (process) {
      setShow(false)
      getAlarms()

    }
  }
  const clearAll = () => {
    setScheduler({
      role: '',
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      shiftRecurrence: '',
      mobileNumber: '',
      duration: '',
      roleError: false,
      startDateError: false,
      endDateError: false,
      startTimeError: false,
      endTimeError: false,
      shiftRecurrenceError: false,
      mobileNumberError: false,
      durationError: false,
    })
  }


  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle title={"Scheduler"} subTitle={"Create Alarm Response"} />
      {
        checkAuthority('CREATE_ALARM_RESPONSE') &&
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
          mx={5}
        >
          <BasicSelector
            disableAll={true}
            options={roles}
            selectorHight={"50px"}
            value={scheduler.role}
            name={"Select Role"}
            selectorWidth={"240px"}
            error={scheduler.roleError}
            onChange={(event) => {
              setScheduler(prevState => ({
                ...prevState,
                role: event.target.value
              }))
            }}
          />




          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileTimePicker
              open={timeOpen}
              onChange={(data) => handleChangeTime(dateType, dataEditId, data)}
              onAccept={(data) => onAccept(dateType, dataEditId, data)}
              variant="inline"
              value={time}
              autoOk={true}
              renderInput={(props) =>
                <TextField
                  {...props} size='small' helperText={null}
                  onChange={(data) => handleChangeTime(dateType, dataEditId, data)}
                  onAccept={(data) => onAccept(dateType, dataEditId, data)}
                  type={'hidden'}
                  sx={{ border: '0px solid white' }}
                  className="txtHide" />}
            />
          </LocalizationProvider>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header">

                  <TableCell component="th" sx={tableHeader}>
                    SelectSite
                  </TableCell>
                  <TableCell component="th" sx={tableHeader} align="center">
                    Add Start Time
                  </TableCell>
                  <TableCell component="th" sx={tableHeader} align="center">
                    Add Finish Time
                  </TableCell>
                  <TableCell width={"50%"} component="th" sx={tableHeader}>
                    Sites Notes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sites.map((item) => (
                  <TableRow key={item.id}>

                    <TableCell sx={tableData}>
                      <Checkbox
                        checked={item.checked}
                        onChange={() => { handleChkChange(item.id) }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      {item.site}</TableCell>
                    <TableCell sx={tableData} align="center">
                      <Box
                        sx={{
                          color: "#43515D",
                          textAlign: "center",
                          border: item.startTimeError ? '0.1px solid red' : '0.1px solid rgb(0,0,0,0.4)',
                          fontWeight: "400",
                          py: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => { openTimePicker('start', item.id) }}
                      >
                        {item.startTime}
                      </Box>

                    </TableCell>
                    <TableCell sx={tableData} align="center">
                      <Box
                        sx={{
                          color: "#43515D",
                          textAlign: "center",
                          border: item.endTimeError ? '0.1px solid red' : '0.1px solid rgb(0,0,0,0.4)',
                          fontWeight: "500",
                          py: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => { openTimePicker('end', item.id) }}
                      >
                        {item.endTime}
                      </Box>
                    </TableCell>
                    <TableCell sx={tableData} style={{ width: "20%" }}>
                      <FormControl fullWidth>
                        <TextField id="standard-basic" label="Note" variant="outlined"
                          onChange={(event) => { changeNote(item.id, event.target.value) }}
                          value={item.sitesNote}
                          error={item.sitesNoteError}
                        />
                      </FormControl>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              backgroundColor: "white",
              boxShadow: "0px 2px 4px 3px rgba(0, 0, 0, 0.08)",
              borderRadius: "10px",
              px: 5,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              py: 4,
            }}
          >
            <FormControl sx={{ display: "flex", flexDirection: "column" }}>
              <Grid container alignItems={"center"}>
                <Grid>
                  <FormLabel
                    style={{
                      fontWeight: 500,
                      fontSize: "Medium",
                      color: "black",
                    }}
                    component="h3"
                  >
                    Mobile Number:
                  </FormLabel>
                </Grid>
              </Grid>

              <Grid container >
                <Grid item>
                  <FormControl fullWidth>
                    <TextField id="outlined-basic" label="Mobile Number" variant="outlined" className="txtInp"
                      value={scheduler.mobileNumber}
                      onChange={(data) => {
                        setScheduler(prevState => ({
                          ...prevState,
                          mobileNumber: data.target.value,
                        }))
                      }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container alignItems={"center"}>
                <Grid>
                  <FormLabel
                    style={{
                      fontWeight: 500,
                      fontSize: "Medium",
                      color: "black",
                    }}
                    component="h3"
                  >
                    Appointment Recurrence:
                  </FormLabel>
                </Grid>
              </Grid>
              <Grid container spacing={3} justifyContent="start">
                <Grid item>

                  <FormControl sx={{ minWidth: "100%" }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <TimePicker
                        options={false}
                        isTimeSelector={true}
                        value={startTimee}
                        name={"Start Time"}
                        label="Start Time"
                        onChange={(newValue) => {
                          setStartTime(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>

                </Grid>
                <Grid item>
                  <FormControl sx={{ minWidth: "100%" }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <TimePicker
                        options={false}
                        value={endTimee}
                        name={"End Time"}
                        label="End Time"
                        isTimeSelector={true}
                        onChange={(newValue) => {
                          setEndTime(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>

                </Grid>
                <Grid item>
                  {/* <BasicSelector
                    disableAll={true}
                    options={durations}
                    selectorHight={"50px"}
                    // isTimeSelector={true}
                    value={scheduler.duration}
                    name={"Duration"}
                    selectorWidth={"240px"}
                    onChange={(event) => {
                      setScheduler(prevState => ({
                        ...prevState,
                        duration: event
                      }))
                    }}
                  /> */}
                   <FormControl sx={{ my: 1, minWidth: "100%" }}>
                              <InputLabel id="duration-label">Duration</InputLabel>
                              <Select
                                value={scheduler.duration}
                                onChange={(event) => {
                                  setScheduler(prevState => ({
                                    ...prevState,
                                    duration: event.target.value
                                  }))
                                  
                                }}
                                displayEmpty
                                labelId="duration-label"
                                id="duration"
                                label="Duration"
                                error={scheduler.durationError}
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
                      fontWeight: 500,
                      fontSize: "Medium",
                      color: "black",
                    }}
                    component="h3"
                  >
                    Recurrence Patterns :
                  </FormLabel>
                </Grid>
                <Grid item xs={12} pb={2}>
                  <FormControl
                    sx={{
                      my: 1,
                      minWidth: "100%",
                      display: "flex !important",
                      columnGap: "10px !important",
                      rowGap: "10px !important",
                      flexDirection: "row !important",
                      flexWrap: "wrap !important",
                      justifyContent: "flex-start",
                    }}
                  >
                    {
                      recurrences.map((item, index) => (
                        <Button variant="outlined" className={item.checked ? 'buttonRootAlt' : classes.buttoRoot}
                          onClick={() => { setRecurrence(item.id) }}
                        >
                          {item.name}
                        </Button>
                      ))
                    }

                  </FormControl>
                </Grid>
              </Grid>
            </FormControl>

            <FormControl sx={{ display: "flex", width: "100%" }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <FormLabel
                    style={{
                      fontWeight: 500,
                      fontSize: "Medium",
                      color: "black",
                    }}
                    component="h3"
                  >
                    Range of Recurrence :
                  </FormLabel>
                </Grid>

                <Grid container spacing={5} justifyContent={"start"}>
                  <Grid item>
                    <LocalDateSelector title="Start Date"
                      value={scheduler.startDate}
                      onChange={(event) => {
                        setScheduler(prevState => ({
                          ...prevState,
                          startDate: event,
                        }))
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <LocalDateSelector title="End Date"
                      value={scheduler.endDate}
                      onChange={(event) => {
                        setScheduler(prevState => ({
                          ...prevState,
                          endDate: event,
                        }))
                      }}
                    />
                  </Grid>
                  {/* <Grid item alignSelf={"center"}>
                    <Button variant="outlined" className={classes.buttoRoot}>
                      End by
                    </Button>
                    <Button variant="outlined" className={classes.buttoRoot}>
                      End after
                    </Button>
                    <Button variant="outlined" className={classes.buttoRoot}>
                      No end date
                    </Button>
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
              }}
            >
              <Button variant="outlined" className={classes.buttoRoot}
                onClick={(e) => {
                  schedulerSubmit()
                  createAla(e)
                  setAction('add')
                }}>
                Ok
              </Button>
              <Button variant="outlined" className={classes.buttoRoot} onClick={()=>navigate(-1)}>
                Cancel
              </Button>
            </FormControl>
          </Box>
          {/* 
          <Grid
            container
            justifyContent={"space-between"}
            spacing={5}
            alignContent="center"
            lg={6}
          >
            <Grid item md={5} xs={12} lg={5}>
              <TextField
                id="out-line-basic"
                variant="outlined"
                placeholder="Enter Guard Mobile Number"
                sx={{
                  width: "240px !important",
                  height: "16px !important",
                  borderRadius: "10px",

                }}
              />
            </Grid>
            <Grid item md={5} xs={6} lg={5} alignSelf={"center"}>
              <Button
                variant="outlined"
                sx={{
                  width: "240px !important",
                  py: "10px !important",
                }}
                className={classes.buttoRoot}
              >
                Send Request
              </Button>
            </Grid>
          </Grid>
           */}
        </Box>
      }

      {
        checkAuthority('VIEW_ALARM_RESPONSES') &&
        <Box display="flex" sx={{ my: "3rem" }}>
          <TableContainer component={Paper} sx={{ mx: "0.8rem", mb: "2rem" }}>
            <div style={{ width: "auto", overflowX: "scroll" }}>
              <Table
                sx={{ minWidth: "auto" }}
                aria-label="custom pagination table"
                className="responsive-table"
              >
                <TableHead>
                  <TableRow className="table-header">
                    {/*                   
                  <TableCell align="center" component="th" sx={tableHeader}>
                    User
                  </TableCell> */}
                    {/* <TableCell align="center" component="th" sx={tableHeader}>
                      Company
                    </TableCell> */}
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Shift Recurrence
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Start Date
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      End Date
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Start Time
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      End Time
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Status
                    </TableCell>

                    <TableCell align="center" component="th" sx={tableHeader}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alarms.map((item, index) => (

                    <TableRow key={index}>
                      {/* <TableCell align="center" sx={tableData}>
                      {fullName(item.userId)}
                    </TableCell> */}
                      {/* <TableCell align="center" sx={tableData}>
                        {item.company?.name}
                      </TableCell> */}
                      <TableCell align="center" sx={tableData}>
                        {item.shiftRecurrence?.name}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {formatDate(item.startDate)}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {formatDate(item.endDate)}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item.startTime}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item.endTime}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item.status}
                      </TableCell>

                      <TableCell align="center" sx={tableData}>

                        <Button color="primary" variant="outlined" sx={{ mx: 2 }} onClick={(e) => {
                          editClick(e, item.id)
                          setAction('edit')
                          }}>
                          <EditIcon />
                        </Button>
                        <Button color="error" variant="outlined" onClick={() => deleteClick(item.id)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </Box>
      }

      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Edit Alarm</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <BasicSelector
              disableAll={true}
              options={roles}
              selectorHight={"50px"}
              value={scheduler.role}
              name={"Select Role"}
              selectorWidth={"500px"}
              error={scheduler.roleError}
              onChange={(event) => {
                setScheduler(prevState => ({
                  ...prevState,
                  role: event.target.value
                }))
              }}
            />

            <FormControl sx={{ minWidth: "100%" }}>

              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                  options={false}
                  isTimeSelector={true}
                  value={startTimee}
                  name={"Start Time"}
                  label="Start Time"
                  onChange={(newValue) => {
                    setStartTime(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
              <FormControl sx={{ minWidth: "100%" }}>

              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                  options={false}
                  value={endTimee}
                  name={"End Time"}
                  label="End Time"
                  isTimeSelector={true}
                  onChange={(newValue) => {
                    setEndTime(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              </FormControl>

              <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header">

                  <TableCell component="th" sx={tableHeader}>
                    SelectSite
                  </TableCell>
                  <TableCell component="th" sx={tableHeader} align="center">
                    Add Start Time
                  </TableCell>
                  <TableCell component="th" sx={tableHeader} align="center">
                    Add Finish Time
                  </TableCell>
                  <TableCell width={"50%"} component="th" sx={tableHeader}>
                    Sites Notes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sites.map((item) => (
                  <TableRow key={item.id}>

                    <TableCell sx={tableData}>
                      <Checkbox
                        checked={item.checked}
                        onChange={() => { handleChkChange(item.id) }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      {item.site}</TableCell>
                    <TableCell sx={tableData} align="center">
                      <Box
                        sx={{
                          color: "#43515D",
                          textAlign: "center",
                          border: item.startTimeError ? '0.1px solid red' : '0.1px solid rgb(0,0,0,0.4)',
                          fontWeight: "400",
                          py: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => { openTimePicker('start', item.id) }}
                      >
                        {item.startTime}
                      </Box>

                    </TableCell>
                    <TableCell sx={tableData} align="center">
                      <Box
                        sx={{
                          color: "#43515D",
                          textAlign: "center",
                          border: item.endTimeError ? '0.1px solid red' : '0.1px solid rgb(0,0,0,0.4)',
                          fontWeight: "500",
                          py: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => { openTimePicker('end', item.id) }}
                      >
                        {item.endTime}
                      </Box>
                    </TableCell>
                    <TableCell sx={tableData} style={{ width: "20%" }}>
                      <FormControl fullWidth>
                        <TextField id="standard-basic" label="Note" variant="outlined"
                          onChange={(event) => { changeNote(item.id, event.target.value) }}
                          value={item.sitesNote}
                          error={item.sitesNoteError}
                        />
                      </FormControl>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

              <FormControl sx={{ display: "flex" }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <FormLabel
                    style={{
                      fontWeight: 500,
                      fontSize: "Medium",
                      color: "black",
                    }}
                    component="h3"
                  >
                    Recurrence Patterns :
                  </FormLabel>
                </Grid>
                <Grid item xs={12} pb={2}>
                  <FormControl
                    sx={{
                      my: 1,
                      minWidth: "100%",
                      display: "flex !important",
                      columnGap: "10px !important",
                      rowGap: "10px !important",
                      flexDirection: "row !important",
                      flexWrap: "wrap !important",
                      justifyContent: "flex-start",
                    }}
                  >
                    {
                      recurrences.map((item, index) => (
                        <Button variant="outlined" className={item.checked ? 'buttonRootAlt' : classes.buttoRoot}
                          onClick={() => { setRecurrence(item.id) }}
                        >
                          {item.name}
                        </Button>
                      ))
                    }

                  </FormControl>
                </Grid>
              </Grid>
            </FormControl>
              <Grid container spacing={5} justifyContent={"start"}>
                <Grid item>
                  <LocalDateSelector title="Start Date"
                    value={scheduler.startDate}
                    onChange={(event) => {
                      setScheduler(prevState => ({
                        ...prevState,
                        startDate: event,
                      }))
                    }}
                  />
                </Grid>
                <Grid item>
                  <LocalDateSelector title="End Date"
                    value={scheduler.endDate}
                    onChange={(data) => {
                      setScheduler(prevState => ({
                        ...prevState,
                        endDate: data,
                      }))
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container >
                <Grid item>
                  <FormControl fullWidth>
                    <TextField id="outlined-basic" label="Mobile Number" variant="outlined" className="txtInp"
                      value={scheduler.mobileNumber}
                      onChange={(data) => {
                        setScheduler(prevState => ({
                          ...prevState,
                          mobileNumber: data.target.value,
                        }))
                      }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  {/* <BasicSelector   
                    disableAll={true}
                    options={durations}
                    selectorHight={"50px"}
                    // isTimeSelector={true}
                    value={scheduler.duration}
                    name={"Duration"}
                    selectorWidth={"240px"}
                    onChange={(event) => {
                      setScheduler(prevState => ({
                        ...prevState,
                        duration: event.target.value
                      }))
                    }}
                  /> */}
                 
                </Grid>
              </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={schedulerSubmit} variant="contained">Update</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* delete Modal */}
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Alarm</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Do you want's to delete this Alarm</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
