import React, { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import BasicSelector from "../../../../common/Selector/index";
import PageTitle from "../../../../common/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getSiteTeam, getSites } from "../../../../../features/sites/sitesAPI";
import { selectSites } from "../../../../../features/sites/sitesSlice";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { deleteAPI, getAPI, patchAPI } from "../../../../network";
import { checkAuthority, formatDate, formatDatePost, fullName, getSetTime, timeFormat, tableHeader, tableData } from '../../../../utils/index';
import Loader from '../../../../common/Loader'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import LocalTimeSelector from "../../../../common/LocalTimeSelector";
// import LocalDateSelector from "../../../../common/LocalDateSelector";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import './style.css'
// import setDate from "date-fns/setDate";dayFrequency
// import { SimCardDownloadRounded } from "@mui/icons-material";
import { useParams } from "react-router-dom";

export default function EditFixedRoster() {
  const [userRole, setUserRole] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startFullTime, setStartFullTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [endFullTime, setEndFullTime] = useState(new Date());
  const [dayFrequency, setDayFrequency] = useState('');
  const { siteId } = useParams();
  const { loading, error, data } = useSelector(selectSites);
  const dispatch = useDispatch();
  const [startTimeOption, setStartTimeOption] = useState([])
  const [user, setUser] = useState('')

  const role = [
    "Manager",
    "Asst.Manager",
    "Controller",
    "Rover",
    "Static",
    "Loss Prevention",
    "Engineer/Technician",
    "Investigator",
    "Analyst",
    "Other",
  ];
  const frequency = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sites, setSites] = useState([]);
  const [roasters, setRoasters] = useState([]);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dstartTime, setDstartTime] = useState(null);
  const [dendTime, setDendTime] = useState(null);
  const [site, setSite] = useState('')
  const [id, setId] = useState('')
  const [userError, setUserError] = useState(false)
  const [siteError, setSiteError] = useState(false)
  const [startTimeError, setStartTimeError] = useState(false)
  const [endTimeError, setEndTimeError] = useState(false)
  const [startDateError, setStartDateError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)


  const [bindSites, setBindSites] = useState([])
  const [bindUsers, setBindUsers] = useState([])

  const [filter, setFilter] = useState({
    siteId: '',
    userId: '',
    startTime: null,
    endTime: null,
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    // getRoasters();
    getSites()
    getRoles()
    getUsers()

    if(siteId !== null && siteId !== ''){
      setFilter({
        ...filter,
        siteId : siteId
      })

      filterRecord(siteId)
    }
  }, [siteId])

  const getSiteName = () => {
    if (sites.length > 0) {
      let site = sites.filter((item) => item._id === siteId)[0];
      return site.name + ', ' + site.address + ', ' + site.city?.name + ', ' + site.country?.name + ' / Fixed Roaster / Edit Fixed Roster'
    }
    else {
      return '';
    }
  }

  const getRoasters = async () => {
    setLoader(true)
    let data = await getAPI('/company/roster?siteId='+siteId)
    if (data) {
      setRoasters(data)
    }
    setLoader(false)
  }

  const getSites = async () => {
    setLoader(true)
    let userType = localStorage.getItem('userType')
    let data = await getAPI(userType === 'admin' ? '/sites' : '/company/sites')
    if (data) {
      setSites(data)
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({ name: data[i].name, value: data[i]._id, label: data[i].name })
      }
      setBindSites(arr)
    }
    setLoader(false)
  }

  const getRoles = async () => {
    setLoader(true)
    let data = await getAPI('/roles')
    if (data) {
      setRoles(data)
    }
    setLoader(false)
  }

  const getUsers = async () => {
    setLoader(true)
    let data = await getAPI('/users')
    if (data) {
      setUsers(data)
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({ name: fullName(data[i]), value: data[i].id, label: fullName(data[i]) })
      }
      setBindUsers(arr)
    }
    setLoader(false)
  }

  const handleChangePage = (data) => {

  }

  const handleChangeRowsPerPage = (data) => {

  }

  const TablePaginationActions = (data) => {

  }

  const clearError = () => {
    setSiteError(false);
    setUserError(false);
    setStartTimeError(false);
    setEndTimeError(false);
    setStartDateError(false);
    setEndDateError(false);
  }

  const toastObj = { position: toast.POSITION.TOP_RIGHT };

  const handleSubmit = async () => {
    clearError();
    if (site === '') {
      toast.warning('Site is required', toastObj);
      setSiteError(true);
      return;
    }
    else if (userId === '') {
      toast.warning('User is required', toastObj);
      setUserError(true);
      return;
    }
    else if (startDate === null) {
      toast.warning('Start Date is required', toastObj);
      setStartDateError(true);
      return;
    }
    else if (endDate === null) {
      toast.warning('End Date is required', toastObj);
      setEndDateError(true);
      return;
    }
    else if (dstartTime === '') {
      toast.warning('Start Time is required', toastObj);
      setDstartTime(true);
      return;
    }
    else if (dendTime === '') {
      toast.warning('End Time is required', toastObj);
      setDendTime(true);
      return;
    }


    let payload = {
      siteId: site,
      assignedUser: userId,
      startDate: formatDatePost(startDate),
      endDate: formatDatePost(endDate),
      startTime: timeFormat(dstartTime),
      endTime: timeFormat(dendTime)
    };

    setLoader(true)
    let data = await patchAPI(`/company/roster/${id}`, payload)
    if (data) {
      getRoasters();
      setOpen(false)
    }
    setLoader(false)
  }

  const handleClose = () => {
    setOpen(false)
  }


  const handleDelete = async () => {
    setLoader(true)
    let data = await deleteAPI(`/company/roster/${id}`);
    if (data) {
      getRoasters();
      setShow(false)
    }
    setLoader(false)
  }

  const editClick = (id) => {
    setId(id);
    let data = roasters.filter((item) => item.id === id)[0];
    console.log("DATA edit button---",data)
    if (data) {
      setDstartTime(getSetTime(data?.startTime))
      setDendTime(getSetTime(data?.endTime));
      setStartDate(new Date(data?.startDate));
      setEndDate(new Date(data?.endDate));
      setUserId(data?.assignedUser?._id);
      setSite(data?.siteId?._id);
    }

    setOpen(true);
  }


  const filterRecord = async (sId = null, uId = null, sDate = null, eDate = null, sTime = null, eTime = null) => {
    
    sId = sId !== null ? sId : filter.siteId;
    uId = uId !== null ? uId : filter.userId;
    sDate = sDate !== null ? sDate : filter.startDate;
    eDate = eDate !== null ? eDate : filter.endDate;
    sTime = sTime !== null ? sTime : filter.startTime;
    eTime = eTime !== null ? eTime : filter.endTime;

    var start = true;
    var params = "";
    if (sId !== '' && sId !== null ) {
      params += (start ? '?' : '&') + `siteId=${sId}`;
      start = false;
    }
    if (uId !== '' && uId  !== null) {
      params += (start ? '?' : '&') + `assignedUser=${uId}`;
      start = false;
    }
    if (sDate !== null && sDate !== '') {
      params += (start ? '?' : '&') + `startDate=${formatDatePost(sDate)}`;
      start = false;
    }
    if (eDate !== null && eDate !== '') {
      params += (start ? '?' : '&') + `endDate=${formatDatePost(eDate)}`;
      start = false;
    }
    if (sTime !== null && sTime !== '') {
      params += (start ? '?' : '&') + `startTime=${timeFormat(sTime)}`;
      start = false;
    }
    if (eTime !== null &&  eTime !== '') {
      params += (start ? '?' : '&') + `endTime=${timeFormat(eTime)}`;
      start = false;
    }


    setLoader(true)
    let data = await getAPI(`/company/roster${params}`);
    if (data) {
      setRoasters(data)
    }
    setLoader(false)
  }


  const deleteClick = (id) => {
    setId(id);
    setShow(true);
  }

  const handleShowClose = () => {
    setShow(false);
  }


  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle
        title="Sites View"
        subTitle={getSiteName()}
      />
      {
        checkAuthority('VIEW_FIXED_ROASTERS') &&
        <>
          <Grid container spacing={3} justifyContent="start">
            <Grid item md={5} xs={12} lg={3}>
              <BasicSelector
                disableAll={true}
                label="Site"
                options={bindSites}
                selectorHight={"53px"}
                value={filter.siteId}
                name="Select Site"
                isTimeSelector={false}
                error={false}

                onChange={(data) => {
                  // setUserRole(data.target.value)
                  setFilter(prevState => ({
                    ...prevState,
                    siteId: data.target.value,
                  }))

                  filterRecord(data.target.value, null, null, null, null, null)
                }}
              />
            </Grid>
            <Grid item md={5} xs={12} lg={3}>
              <BasicSelector
            disableAll={true}
            label="User"
            options={bindUsers}
            selectorHight={"53px"}
            value={filter.userId}
            name="Select User"
            isTimeSelector={false}
            error={false}
            
            onChange={(data) => {
              setFilter(prevState => ({
                  ...prevState,
                  userId: data.target.value,
              }))
              filterRecord(null,data.target.value, null,null,null,null)
            }}

            
          />
          </Grid>
          {/* <Grid item md={5} xs={12} lg={3}>
          <FormControl fullWidth >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="End Time"
                value={endFullTime}
                error={endTimeError}
                changeFullTime={(data) => { setEndFullTime(data) }}
                renderInput={(params) => <TextField {...params} />}
                onChange={(data) => {
                  setFilter(prevState => ({
                    ...prevState,
                    endTime: data.target.value,
                  }))
                  filterRecord(null, data.target.value, null, null, null, null)
                }}
              />
            </LocalizationProvider>
            </FormControl> 
            </Grid> */}
            {/* <Grid item md={5} xs={12} lg={3}>
              <BasicSelector
                disableAll={true}
                options={endTimeOption}
                isTimeSelector={true}
                selectorHight={"53px"}
                value={endFullTime}
                shortValue={endTime}
                changeTime={(data) => { setEndTime(data) }}
                changeFullTime={(data) => { setEndFullTime(data) }}
                setTimeOption={(data) => setEndTimeOption(data)}
                name={"Finish Time"}
                // width="100%"
                onChange={(data) => {
                  setFilter(prevState => ({
                    ...prevState,
                    endTime: data.target.value,
                  }))
                  filterRecord(null, data.target.value, null, null, null, null)
                }}
              />
            </Grid> */}
            {/* <Grid item md={5} xs={12} lg={3}>
              <BasicSelector
                disableAll={true}
                options={frequency}
                selectorHight={"53px"}
                value={dayFrequency}
                onChange={(data) => { setDayFrequency(data.target.value) }}
                name={"Frequency"}
              />
            </Grid> */}
          </Grid>
          <Box display="flex" sx={{ my: "3rem" }}>
            <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
              <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
                <TableHead >
                  <TableRow className="table-header">
                    <TableCell align="center" component="th" sx={tableHeader}>Site</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>Shift Code</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>User</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>Start Date</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>End Date</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>Start Time</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>End Time</TableCell>
                    <TableCell align="center" component="th" sx={tableHeader}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {
                    roasters.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" sx={tableData}>
                          {item?.siteId === null ? '' : item?.siteId?.name}
                        </TableCell>
                        <TableCell align="center" sx={tableData}>
                          {item?.shiftCode}
                        </TableCell>
                        <TableCell align="center" sx={tableData}>
                          {item.assignedUser?.firstname} {item.assignedUser?.lastname}
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
                        <TableCell align="center" sx={tableData}>
                          {
                            checkAuthority('EDIT_FIXED_ROASTER') &&
                            <Button color="primary" variant="outlined" sx={{ mx: 2, height: 50 }} onClick={() => editClick(item?.id)}>
                              <EditIcon />
                            </Button>
                          }
                          {
                            checkAuthority('DELETE_FIXED_ROASTER') &&
                            <Button color="error" variant="outlined" sx={{ height: 50 }} onClick={() => deleteClick(item?.id)}>
                              <DeleteIcon />
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  }

                </TableBody>
                {/* <TableFooter>
                <TableRow>
                    <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={roasters.length}
                    rowsPerPage={100}
                    page={1}
                    SelectProps={{
                        inputProps: {
                        'aria-label': 'rows per page',
                        },
                        native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
                </TableFooter> */}
              </Table>

            </TableContainer>
          </Box>
        </>
      }

      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ textAlign: 'center', mb: 8 }}>Update Roaster</DialogTitle>
        <DialogContent sx={{ width: '100%' }} style={{ width: '100%' }}>

          <FormControl sx={{ my: 1 }} fullWidth>
            <InputLabel id="site-label">Site</InputLabel>
            <Select
              labelId="site-label"
              id="site"
              value={site}
              label="Site"
              error={siteError}
              onChange={(data) => setSite(data.target.value)}
            >
              {
                sites.map((item, index) => (
                  <MenuItem value={item._id} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl sx={{ my: 1 }} fullWidth>
            <InputLabel id="user-label">User</InputLabel>
            <Select
              labelId="user-label"
              id="user"
              value={userId}
              label="User"
              error={userError}
              onChange={(data) => setUserId(data.target.value)}
            >
              {
                users.map((item, index) => (
                  <MenuItem value={item.id} key={index}>{fullName(item)}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl sx={{ my: 1 }} fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                className="modal-component"
                label="Start Date"
                inputFormat="dd/MM/yyyy"
                value={startDate}
                onChange={(data) => {
                  setStartDate(data)
                }}
                error={startDateError}
                fullWidth
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ my: 1 }} fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns} >
              <DesktopDatePicker
                className="modal-component"
                label="End Date"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={(data) => setEndDate(data)}
                error={endDateError}
                fullWidth
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ my: 1 }} fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Start Time"
                value={dstartTime}
                onChange={(data) => {
                  setDstartTime(data)
                }}
                error={startTimeError}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ my: 1 }} fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="End Time"
                value={dendTime}
                error={endTimeError}
                onChange={(data) => setDendTime(data)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ mx: 2, mb: 4 }}>
          <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Company Roaster</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { my: 2, width: '100%' }, }}
            noValidate
            autoComplete="off"
          >
            <h4 style={{ textAlign: 'left', fontWeight: 'bold' }}>Do you want's to delete this company roaster</h4>
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