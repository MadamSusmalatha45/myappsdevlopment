import React, { useEffect, useState } from "react";
import { Box, Grid, TextareaAutosize, Typography, Button, InputLabel } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import Loader from '../../common/Loader'
import { getAPI, postAPI, patchAPI, deleteAPI } from '../../network'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from "@mui/x-date-pickers";
import { duration } from "../../utils/data";
import Header from "../../layout/Header";
import AccountMenu from '../../layout/AccountMenu'

import "./style.css";
import { formatDate, formatDatePost, getSetTime, timeFormat, validation, fullName, checkAuthority, tableHeader, tableData, durationCalc } from "../../utils";

export default function NotificationPage() {
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [id, setId] = useState('');
  const [loader, setLoader] = useState(false);
  const [notifications, setNotifications] = useState([])
  const [action, setAction] = useState('add');
  const [open, setOpen] = useState(false)
  const [endBy, setEndBy] = useState(false);
  const [endAfter, setendAfter] = useState(false);
  const [noend, setNoend] = useState(false);
  const [show, setShow] = useState(false)
  const [sites, setSites] = useState([])
  const [company, setCompany] = useState([])
  const [recurrences, setRecurrences] = useState([])
  const [users, setUsers] = useState([])
  const [client, setClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({
    shiftStatus: "",
  });
  const [notification, setNotification] = useState({
    notes: '',
    startTime: null,
    endTime: null,
    startDate: null,
    endDate: null,
    shiftRecurrence: null,
    siteId: '',
    userId: '',
    company: '',
    duration: '',
    endType: '',
    recurrenceDay: [],
    durationError: false,
    notesError: false,
    startTimeError: false,
    endTimeError: false,
    startDateError: false,
    endDateError: false,
    shiftRecurrenceError: false,
    siteIdError: false,
    userIdError: false,
    companyIdError: false,
  })
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
    value: 6
  }];
  const [checked, setChecked] = useState([]);


  useEffect(() => {
    getNotifications()
    getSites()
    getRecurrences()
    getUsers()
    getCompany()
  }, [])

  const clearAll = () => {
    setNotification({
      notes: '',
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      shiftRecurrence: null,
      siteId: '',
      userId: '',
      company: '',
      duration: '',
      endType: '',
      recurrenceDay: [],
      durationError: false,
      notesError: false,
      startTimeError: false,
      endTimeError: false,
      startDateError: false,
      endDateError: false,
      shiftRecurrenceError: false,
      siteIdError: false,
      userIdError: false,
      companyIdError: false,

    })

  }

  const getNotifications = async () => {
    setLoader(true);
    let data = await getAPI('/notifications')
    if (data) {
      setNotifications(data)
    }
    setLoader(false);
  }


  const getUsers = async () => {
    setLoader(true);
    let data = await getAPI('/users')
    if (data) {
      setUsers(data)
    }
    setLoader(false);
  }
  const getCompany = async () => {
    setLoader(true);
    let data = await getAPI('/companies')
    if (data) {
      setCompany(data)
    }
    setLoader(false);
  }

  const getSites = async () => {
    setLoader(true)
    let data = await getAPI('/sites');
    if (data) {
      setSites(data)
    }
    setLoader(false)
  }


  const getRecurrences = async () => {
    setLoader(true)
    let data = await getAPI('/recurrence');
    if (data) {
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({ id: data[i].id, name: data[i].name, checked: false })
      }
      setRecurrences(arr)
    }
    setLoader(false)
  }

  const changeStartTime = (event) => {
    setSelectedStartTime(event.target.value);
  };

  const editClick = (id) => {
    setId(id);
    setAction('edit');
    let note = notifications.filter((item) => item?.id === id)[0]
    setNotification(prevState => ({
      ...prevState,
      notes: note.notes,
      startTime: getSetTime(note?.startTime),
      endTime: getSetTime(note?.endTime),
      startDate: new Date(note?.startDate),
      endDate: new Date(note?.endDate),
      endType: note?.endType,
      shiftRecurrence: note?.shiftRecurrence,
      recurrenceDay: note?.recurrenceDay,
      siteId: note.siteId?._id,
      userId: note.userId?._id,
      company: note.company?.id,
    }))

    setOpen(true)
  }

  const deleteClick = (id) => {
    setId(id);
    setShow(true)
  }

  const handleShowClose = () => {
    setShow(false)
  }
  const onChangeDuration = (event) => {
    setNotification(prevState => ({
      ...prevState,
      duration: event.target.value,
    }))
  }


  const allClear = () => {
    setNotification(prevState => ({
      ...prevState,
      notes: '',
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      shiftRecurrence: '',
      siteId: '',
      userId: '',
      company: '',
      endType: '',
      recurrenceDay: [],
      setChecked: [],
      duration: null,
      durationError: false,
      notesError: false,
      startTimeError: false,
      endTimeError: false,
      startDateError: false,
      endDateError: false,
      shiftRecurrenceError: false,
      siteIdError: false,
      userIdError: false,
      companyIdError: false

    }))
  }

  const handleClose = () => {
    setOpen(false)
    setNotification(prevState => ({
      ...prevState,
      notes: '',
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      shiftRecurrence: '',
      siteId: '',
      userId: '',
      company: '',
      endType: '',
      duration: null,
      durationError: false,
      notesError: false,
      startTimeError: false,
      endTimeError: false,
      startDateError: false,
      endDateError: false,
      shiftRecurrenceError: false,
      siteIdError: false,
      userIdError: false,
      companyIdError: false
    }))
  }

  const handleSubmit = async (action) => {

    setNotification(prevState => ({
      ...prevState,
      notesError: false,
      startTimeError: false,
      endTimeError: false,
      startDateError: false,
      endTimeError: false,
      shiftRecurrenceError: false,
      recurranceError: false,
      siteIdError: false,
      durationError: false,
      userIdError: false,
      endTypeError: false,
    }))



    if (validation('empty', 'Site', notification.siteId)) {
      setNotification(prevState => ({
        ...prevState,
        siteIdError: true
      }))
      return;
    }
    if (validation('empty', 'Company', notification.company)) {
      setNotification(prevState => ({
        ...prevState,
        CompanyIdError: true
      }))
      return;
    }

    if (validation('empty', 'User', notification.userId)) {
      setNotification(prevState => ({
        ...prevState,
        userIdError: true
      }))
      return;
    }
    else if (validation('long', 'Notification', notification.notes)) {
      setNotification(prevState => ({
        ...prevState,
        notesError: true
      }))
      return;
    }

    else if (validation('time', 'Start Time', notification.startTime)) {
      setNotification(prevState => ({
        ...prevState,
        startTime: true
      }))
      return;
    }
    else if (validation('time', 'End Time', notification.endTime)) {
      setNotification(prevState => ({
        ...prevState,
        endTime: true
      }))
      return;
    }
    else if (validation('date', 'Start Date', notification.startDate)) {
      setNotification(prevState => ({
        ...prevState,
        startDate: true
      }))
      return;
    }
    else if (validation('date', 'End Date', notification.endDate)) {
      setNotification(prevState => ({
        ...prevState,
        endDate: true
      }))
      return;
    }
    else if (validation('empty', 'RecurranceDay', notification.recurrenceDay)) {
      setNotification(prevState => ({
        ...prevState,
        recurrenceDay: true
      }))
      return;
    }
    // else if(validation('time', 'Shift Recurrence',notification.shiftRecurrence) ){
    //   setNotification(prevState => ({
    //     ...prevState,
    //     shiftRecurrence : true
    //   }))
    //   return;
    // }

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

    // console.log("checked value#####################",checkedval)


    let payload = {
      notification: notification.notes,
      notes: notification.notes,
      startTime: timeFormat(notification.startTime),
      endTime: timeFormat(notification.endTime),
      startDate: formatDatePost(notification.startDate),
      endDate: formatDatePost(notification.endDate),
      shiftRecurrence: "Weekly",
      siteId: notification.siteId,
      duration: notification.duration,
      userId: notification.userId,
      Company: notification.company,
      endType: notification.endType,
      recurrenceDay: checkedval
    }

    console.log("------PAYLOAD-----", payload)
    if (action === 'add') {
      setLoader(true)
      let data = await postAPI('/notifications', payload)
      if (data) {
        setOpen(false)
        getNotifications()
      }
      setLoader(false)
      clearAll()
    }
    else {
      setLoader(true)
      let data = await patchAPI(`/notifications/${id}`, payload)
      if (data) {
        setOpen(false)
        getNotifications()
        setNotification(prevState => ({
          ...prevState,
          notes: '',
          startTime: null,
          endTime: null,
          startDate: null,
          endDate: null,
          shiftRecurrence: '',
          siteId: '',
          userId: '',
          company: '',
          duration: '',
          endType: '',
          recurrenceDay: [],
          durationError: false,
          notesError: false,
          startTimeError: false,
          endTimeError: false,
          startDateError: false,
          endDateError: false,
          shiftRecurrenceError: false,
          siteIdError: false,
          companyIdError: false
        }))
      }
      setLoader(false)
    }
    clearAll()


  }

  const handleDelete = async () => {
    setLoader(true)

    let data = await deleteAPI(`/notifications/${id}`);
    if (data) {
      getNotifications()
      setShow(false)
      AccountMenu()
    }
    setLoader(false)

  }

  const handleRecurrenceChange = (event) => {
    setNotification(prevState => ({
      ...prevState,
      shiftRecurrence: event.target.value,
    }))
  }



  const handleChange = (event) => {
    setNotification(prevState => ({
      ...prevState,
      siteId: event.target.value,
    }))
  };
  const handleCompChange = (event) => {
    setNotification(prevState => ({
      ...prevState,
      company: event.target.value,
    }))
  };
  const handleUserChange = (event) => {
    setNotification(prevState => ({
      ...prevState,
      userId: event.target.value,
    }))
  };

  const setChoice = (id) => {
    var data = recurrences.map((item) => {
      if (item.id === id) {
        return { id: item.id, name: item.name, checked: true }
      }
      else {
        return { id: item.id, name: item.name, checked: false }
      }
    })
    setNotification(prevState => ({
      ...prevState,
      shiftRecurrence: id,
    }))

    setRecurrences(data)
  }
  const endByset = (value) => {
    console.log("ENDBYE selected", value)
    setNotification(prevState => ({
      ...prevState,
      endType: value,
    }))

  }
  const setEndByy = () => {
    setEndBy(current1 => !current1);
    setNoend(false)
    setendAfter(false)
  }
  const setNoendd = () => {
    setNoend(current3 => !current3);
    setEndBy(false)
    setendAfter(false)
  }
  const setendAfterr = () => {
    setendAfter(current2 => !current2);
    setEndBy(false)
    setNoend(false)

  }
  const findDuration = (fromDate = null, toDate = null) => {
    let newFromDate = fromDate !== null ? fromDate : notification.startTime;
    let newToDate = toDate !== null ? toDate : notification.endTime;

    if (newFromDate !== null && newToDate !== null) {
      return durationCalc(newFromDate, newToDate);
      // let duration = durationCalc(newFromDate, newToDate)
      // setNotification({
      //   ...notification,
      //   duration : duration
      // })
    }
    else {
      return null;
    }

  }


  const onStartDateChange = (data) => {

    setNotification({
      ...notification,
      startTime: data,
      duration: findDuration(data, null)
    })

    // findDuration(data, null)
  }



  const onEndDateChange = (data) => {

    setNotification({
      ...notification,
      endTime: data,
      duration: findDuration(data, null)
    })

    // findDuration(null,data)
  }

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const onChange = (event) => {
    if (event.target.name === "client") {
      setClient(event.target.value);
    } else
      setSelectedStatus({
        [event.target.name]: event.target.value,
        ...selectedStatus,
      });
  };

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


  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Notifications" />
      {
        checkAuthority('ADD_NOTIFICATION') &&
        <Box
          display="flex"
          className="box-container"
          sx={{ mx: "0.5rem", p: "2rem" }}
        >

          <Grid container className="grid-row">
            <Grid item xs={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h6" className="site">
                Company :
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ mb: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company-label"
                  id="company-select"
                  value={notification.company}
                  label="Company"
                  error={notification.companyIdError ? true : false}
                  onChange={handleCompChange}
                >
                  {
                    company.map((item, index) => (
                      <MenuItem value={item.id} key={index}>{item?.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={7}>

            </Grid>
            <Grid item xs={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h6" className="site">
                Site :
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ mb: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="site-label">Site</InputLabel>
                <Select
                  labelId="site-label"
                  id="site-select"
                  value={notification.siteId}
                  label="Site"
                  error={notification.siteIdError ? true : false}
                  onChange={handleChange}
                >
                  {
                    sites.map((item, index) => (
                      <MenuItem value={item?._id} key={index}>{item?.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={7}>

            </Grid>

            <Grid item xs={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h6" className="site">
                User :
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ mb: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="user-label">User</InputLabel>
                <Select
                  labelId="user-label"
                  id="user-select"
                  value={notification.userId}
                  label="User"
                  error={notification.userIdError ? true : false}
                  onChange={handleUserChange}
                >
                  {
                    users.map((item, index) => (
                      <MenuItem value={item?.id} key={index}>{fullName(item)}</MenuItem>

                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={7}>

            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" component="h6" className="site">
                Notification :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={5}
                placeholder="Type notification here"
                className={notification.notesError ? "txt-input-error" : "txt-input"}
                onChange={(event) => {
                  setNotification(prevState => ({
                    ...prevState,
                    notes: event.target.value,
                  }))
                }}
              />
            </Grid>
            <Grid item xs={6}>

            </Grid>

            <Grid item xs={12} sx={{ mt: "2rem" }}>
              <Typography variant="h6" component="h6" className="site">
                Appointment Recurrence :
              </Typography>
            </Grid>

            <Grid item xs={3} sx={{ my: "1rem", mx: "1rem" }}>
              {/* <FormControl sx={{ m: 1, width: "90%", backgroundColor: "white" }}>
              <Select
                value={selectedStartTime}
                onChange={changeStartTime}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                style={{
                  borderRadius: 10,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderColor: "#707070",
                }}
              >
                <MenuItem value="">
                  <div className="select-item">Start Time</div>
                </MenuItem>
                <MenuItem value={1} key={1}>
                  Test
                </MenuItem>
              </Select>
            </FormControl> */}

              <FormControl fullWidth >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <TimePicker
                    className={notification.startTimeError ? "error" : null}
                    label="Start Time"
                    value={notification.startTime}
                    onChange={(data) => {
                      onStartDateChange(data)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={3} sx={{ my: "1rem", mx: "1rem" }}>
              {/* <FormControl sx={{ m: 1, width: "90%", backgroundColor: "white" }}>
              <Select
                value={selectedStartTime}
                onChange={changeStartTime}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                style={{
                  borderRadius: 10,
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  borderColor: "#707070",
                }}
              >
                <MenuItem value="">
                  <div className="select-item">Finish Time</div>
                </MenuItem>
                <MenuItem value={1} key={1}>
                  Test
                </MenuItem>
              </Select>
            </FormControl> */}
              <FormControl fullWidth >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <TimePicker
                    className={notification.endTimeError ? "error" : null}
                    label="End Time"
                    value={notification.endTime}
                    onChange={(data) => {
                      onEndDateChange(data)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>


            <Grid item xs={3} sx={{ my: "8px", mb: "8px" }}>
              <FormControl sx={{ my: 1, minWidth: "100%" }}>
                <InputLabel id="duration-label">Duration</InputLabel>
                <Select
                  value={notification.duration}
                  onChange={onChangeDuration}
                  displayEmpty
                  labelId="duration-label"
                  id="duration"
                  label="Duration"
                  error={notification.durationError}
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

              {/* <FormControl fullWidth >
                <LocalizationProvider dateAdapter={AdapterMoment}>

                    <DatePicker
                      // className={notification.durationError ? "error" : null}
                      label="Duration"
                      value={notification.duration}
                      error={false}
                      onChange={(data) => { 
                        setNotification(prevState => ({
                        ...prevState,
                        duration: data,
                      }))}}
                      renderInput={(params) => <TextField {...params} />}
                    />

                </LocalizationProvider>
            </FormControl>  */}

            </Grid>

            <Grid item xs={3} sx={{ my: "1rem" }}></Grid>

            <Grid item xs={12} sx={{ my: "1rem" }}>
              <Typography variant="h6" component="h6" className="site">
                Recurrence Pattern:
              </Typography>
            </Grid>

            <Grid item xs={12} >

              <Button variant="outlined" className={'row-btn-alt'}
              >
                Weekly
              </Button>
              {/* {isShow && */}
              <Typography>
                <h4>Please Select Recurrence Day</h4>
                <Grid className="mt-2 mb-2">
                  <div className="h-10" >
                    {console.log("checkList==========", checkListWeek)}
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

            <Grid item xs={12} sx={{ my: "1rem", mt: "5rem" }}>
              <Typography variant="h6" component="h6" className="site">
                Range of Recurrence :
              </Typography>
            </Grid>

            <Grid item xs={3} sx={{ mb: "1rem", px: 2 }}>
              <FormControl fullWidth >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    className={notification.startDateError ? "error" : null}
                    label="Start date"
                    value={notification.startDate}
                    onChange={(data) => {
                      setNotification(prevState => ({
                        ...prevState,
                        startDate: data,
                      }))
                    }}

                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                {/* <LocalDateSelector 
                  title="Start Date" 
                /> */}
              </FormControl>

            </Grid>

            <Grid item xs={3} sx={{ mb: "1rem", px: 2 }}>
              <FormControl fullWidth >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    className={notification.endDateError ? "error" : null}
                    label="End Date"
                    value={notification.endDate}
                    onChange={(data) => {
                      setNotification(prevState => ({
                        ...prevState,
                        endDate: data,
                      }))
                    }}

                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>

            </Grid>

            <Grid item xs={5} className="btn-div-grid">
              <div className="btn-row">
                <Button variant="outlined" style={{
                  backgroundColor: endBy ? '#42505C' : '',
                  color: endBy ? 'white' : '',
                }} className="row-btn" value="endBy"
                  onClick={(e) => {
                    endByset(e.target.value)
                    setEndByy()
                  }}
                >
                  End By

                </Button>
                <Button variant="outlined" style={{
                  backgroundColor: endAfter ? '#42505C' : '',
                  color: endAfter ? 'white' : '',
                }} className="row-btn" value="endAfter"
                  onClick={(e) => {
                    endByset(e.target.value)
                    setendAfterr()

                  }}
                >
                  End After
                </Button>
                <Button variant="outlined" style={{
                  backgroundColor: noend ? '#42505C' : '',
                  color: noend ? 'white' : '',
                }} className="row-btn" value="endDate"
                  onClick={(e) => {
                    endByset(e.target.value)
                    setNoendd()
                  }} >
                  No End Date
                </Button>
              </div>
            </Grid>
            <Grid item xs={4} sx={{ my: "1rem", mt: "2rem" }}></Grid>

            <Grid item xs={12} sx={{ my: "1rem", mt: "3rem" }}>
              <div className="btn-row-center">
                <Button
                  variant="outlined"
                  className="row-btn"
                  sx={{ mx: "3rem" }}
                  onClick={() => { handleSubmit('add') }}
                >
                  Ok
                </Button>
                <Button variant="outlined" className="row-btn" onClick={allClear}>
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      }

      {
        checkAuthority('VIEW_NOTIFICATIONS') &&
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
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Notification
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Site
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
                    <TableCell align="left" component="th" sx={tableHeader}>
                      Site Notes
                    </TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log("notificationsss-----", notifications)}
                  {notifications.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" sx={tableData}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item?.siteId?.name}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {formatDate(item?.startDate)}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {formatDate(item?.endDate)}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item?.startTime}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {item?.endTime}
                      </TableCell>
                      <TableCell align="left" sx={tableData}>
                        {item?.notes}
                      </TableCell>
                      <TableCell align="center" sx={tableData}>
                        {
                          checkAuthority('EDIT_NOTIFICATION') &&
                          <Button className="btn-div" color="primary" variant="outlined" sx={{ mx: 2 }} onClick={() => editClick(item?.id)}>
                            <EditIcon className="btn" />
                          </Button>
                        }
                        {
                          checkAuthority('DELETE_NOTIFICATION') &&
                          <Button className="btn-div" color="error" variant="outlined" onClick={() => deleteClick(item?.id)}>
                            <DeleteIcon className="btn" />
                          </Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </Box>
      }


      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ textAlign: 'center', mb: 8 }}>Edit Notification</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="site-label" className="site">Site</InputLabel>
            <Select
              labelId="site-label"
              id="site-select"
              value={notification.siteId}
              label="Site"
              onChange={handleChange}
              className="site"
            >
              {
                sites.map((item, index) => (
                  <MenuItem value={item._id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="user-label">User</InputLabel>
            <Select
              labelId="user-label"
              id="user-select"
              value={notification.userId}
              label="User"
              onChange={handleUserChange}
            >
              {
                users.map((item, index) => (
                  <MenuItem value={item.id} key={index}>{fullName(item)}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              id="notification"
              label="Notification"
              type="text"
              rows={2}
              multiline
              defaultValue={notification.notes}
              onChange={(event) => {
                setNotification(prevState => ({
                  ...prevState,
                  notes: event.target.value,
                }))
              }}
              fullWidth
              error={notification.notesError ? true : false}
            />
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                className={notification.startTimeError ? "error" : null}
                label="Start Time"
                value={notification.startTime}
                onChange={(data) => {
                  setNotification(prevState => ({
                    ...prevState,
                    startTime: data,
                  }))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>


          <FormControl fullWidth sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                className={notification.endTimeError ? "error" : null}
                label="End Time"
                value={notification.endTime}
                onChange={(data) => {
                  setNotification(prevState => ({
                    ...prevState,
                    endTime: data,
                  }))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                className={notification.startDateError ? "error" : null}
                label="Start Date"
                value={notification.startDate}
                onChange={(data) => {
                  setNotification(prevState => ({
                    ...prevState,
                    startDate: data,
                  }))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                className={notification.endDateError ? "error" : null}
                label="End Date"
                value={notification.endDate}
                onChange={(data) => {
                  setNotification(prevState => ({
                    ...prevState,
                    endDate: data,
                  }))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>



          {/* <FormControl fullWidth>
                         <InputLabel id="shift-label">Shift Recurrence</InputLabel>
                          <Select
                            labelId="shift-label"
                            id="shift-select"
                            value={notification.shiftRecurrence}
                            label="Shift Recurrence"
                            onChange={(event) => {handleRecurrenceChange(event)}}
                          >
                            {
                              recurrences.map((item, index) => (
                                <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                              ))
                            }
                          </Select>
                    </FormControl>   */}
        </DialogContent>
        <DialogActions sx={{ mx: 2, mb: 4 }}>
          <Button onClick={() => handleSubmit('edit')} variant="contained" color="primary">Update</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Notification</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { my: 2, width: '100%' }, }}
            noValidate
            autoComplete="off"
          >
            <h4 style={{ textAlign: 'left', fontWeight: 'bold' }}>Do you want's to delete this notification</h4>
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
