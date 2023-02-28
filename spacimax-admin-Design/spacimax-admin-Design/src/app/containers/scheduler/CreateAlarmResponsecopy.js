import React, { useEffect, useState } from "react";
import {
  Box,
  TableContainer,
  TableBody,
  Table,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TableCell,
  FormControl,
  FormLabel,
  Button,
  Alert,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Select as Choice }  from '@mui/material';
import Select from 'react-select';
import BasicSelector from "../../common/Selector";
import LocalTimeSelector from "../../common/LocalTimeSelector";
import { useDispatch, useSelector } from "react-redux";
import { addCheckpoints, getSites } from "../../../features/sites/sitesAPI";
import { Controller, useForm } from "react-hook-form";
import { selectTasks } from "../../../features/tasks/tasksSlice";
import { selectSites } from "../../../features/sites/sitesSlice";
import { selectCompanies } from "../../../features/company/companySlice";
import { getCompanies } from "../../../features/company/companyAPI";

import { useNavigate } from "react-router-dom";
import { getAPI, postAPI, patchAPI } from "../../network";

import { useLocation } from "react-router-dom";

import { toast } from "react-toastify";

import PageTitle from "../../common/PageTitle";
import LocalDateSelector from "../../common/LocalDateSelector";
import { duration } from '../../utils/data'
import Loader from "../../common/Loader";
import './style.css'
// import { getAPI, postAPI, deleteAPI, putAPI } from "../../network";
import { ScheduleSharp } from "@material-ui/icons";
import { checkAuthority, formatDate, formatDatePost, fullName, timeFormat, uniqueArray, validation, tableHeader, tableData } from "../../utils";
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import "./style.css";

const useStyles = makeStyles(() => ({

  buttoRoot: {
    borderColor: "#707070 !important;",
    color: "#202E43 !important;",
    borderRadius: "8px !important;",
    fontSize: "16px  !important;",
    textTransform: "none !important;",
    padding: "0px 30px !important;",
    marginRight: "15px !important;",
    "&:hover": {
      backgroundColor: " #42505C !important;",
      color: "white !important",
    },
  },
}));


export default function CreateAlarmResponse() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const { loading, error } = useSelector(selectTasks);
  const { data: sitesData } = useSelector(selectSites);
  const { data: companiesData } = useSelector(selectCompanies);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');
  const [companyError, setCompanyError] = useState(false);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState(false);

  const [statusError, setStatusError] = useState(false);
  const [status, setStatus] = useState("");
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState([]);
  const [siteError, setSiteError] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [dueDateError, setDueDateError] = useState(false);
  const [dueTime, setDueTime] = useState(null);
  const [dueTimeError, setDueTimeError] = useState(false);
  const [desc, setDesc] = useState('')
  const [descError, setDescError] = useState('')
  const [action, setAction] = useState('add');
  const [btnTxt, setBtnTxt] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [editId, setEditId] = useState('');

  useEffect(() => {
    dispatch(getSites());
    dispatch(getCompanies());
    sideLists();
    companyLists();
    UserLists();
    if (location) {
      if (location.state) {
        const task = location.state.task;
        setAction('edit')
        setEditId(task._id);
        setCompany(task.companyId?._id)
        setUser(task.userId?.id)
        setSite(task.siteId);
        setTitle(task.title);
        setDesc(task.description);
        setDueDate(new Date(task.dueDate));
        var date = new Date(task.dueDate);
        let time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + task.timeDue;
        setDueTime(new Date(time))
      }
    }
  }, [location]);


  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      siteId: [],
      companyId: "",
      userId: "",
      dueDate: new Date(),
      timeDue: new Date(),
      description: "",
    },
  });

  const dateFormat = (date) => {
    var newDate = new Date(date);
    return newDate.getFullYear() + '-' + (newDate.getMonth().toString().length === 1 ? `0${newDate.getMonth()}` : newDate.getMonth()) + '-' + (newDate.getDay().toString().length === 1 ? `0${newDate.getDay()}` : newDate.getDay());
  }
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const timeFormat = (time) => {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}`.toString() : minutes;
    hours = hours < 10 ? `0${hours}`.toString() : hours;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  const Status = [
    { label: "Partially Completed", value: "Partially Completed" },
    { label: "Completed", value: "Completed" },
    { label: "UpComming", value: "UpComming" },
    { label: "Opened", value: "Opened" },

  ]

  const toastObj = { position: toast.POSITION.TOP_RIGHT };

  const onSubmit = async (e) => {
    e.preventDefault();

    setTitleError(false);
    setSiteError(false);
    setCompanyError(false);
    setUserError(false);
    setDescError(false);
    setDueDateError(false);
    setDueTimeError(false);

    if (title === '' || title.length < 3) {
      toast.warning('Title is required! and at least 3 character long', toastObj);
      setTitleError(true);
      return;
    }
    else if (site === '') {
      toast.warning('Site ID is required!', toastObj);
      setSiteError(true);
      return;
    }
    else if (company === '') {
      toast.warning('Company ID is required!', toastObj);
      setCompanyError(true);
      return;
    }
    else if (user === '') {
      toast.warning('User is required!', toastObj);
      setUserError(true);
      return;
    }
    else if (dueDate === null) {
      toast.warning('Due date is required!', toastObj);
      setDueDateError(true);
      return;
    }
    else if (dueTime === null) {
      toast.warning('Due time is required!', toastObj);
      setDueTimeError(true);
      return;
    }
    var ids = site.map((item) => {
      return item.value
    });

    if (action === 'add') {
      let payload = {
        companyId: company,
        siteId: ids,
        title: title,
        userId: user,
        status: status,
        dueDate: convert(dueDate),
        timeDue: timeFormat(dueTime),
        description: desc
      };


      setLoader(true)
      var saveStatus = await postAPI('/tasks', payload);
      setLoader(false)
      if (saveStatus) {
        navigateTo("/tasks/list")
      }
    }
    else if (action === 'edit') {
      let payload = {
        companyId: company,
        siteId: ids,
        title: title,
        userId: user,
        status: status,
        dueDate: convert(dueDate),
        timeDue: timeFormat(dueTime),
        description: desc
      };
      let url = `/tasks/${editId}`;
      setLoader(true)
      var saveStatus = await patchAPI(url, payload);
      setLoader(false)
      if (saveStatus) {
        navigateTo("/tasks/list")
      }
    }
  };
  const sideLists = async () => {
    let process = await getAPI('/sites');
    if (process) {
      var sites = [];
      for (var i = 0; i < process.length; i++) {
        sites.push({ label: process[i].name, value: process[i]._id })
      }
      setSites(sites);
    }
  }

  const companyLists = async () => {
    let process = await getAPI('/companies');
    if (process) {
      var companies = [];
      for (var i = 0; i < process.length; i++) {
        companies.push({ label: process[i].name, value: process[i].id })
      }
      setCompanies(companies);
    }
  }


  const UserLists = async () => {
    let process = await getAPI('/users');

    if (process) {
      var users = [];
      for (var i = 0; i < process.length; i++) {
        var obj = process[i]
        obj['fullName'] = process[i].firstname + ' ' + process[i].lastname
        obj['label'] = process[i].firstname + ' ' + process[i].lastname
        obj['value'] = process[i].id

        users.push(obj)

      }

      setUsers(users);
    }
  }


  return (
    <Box>
      <Loader loader={loader} />
      <PageTitle title={"Scheduler"} subTitle={"Create Alarm Response"} />
      {
        checkAuthority('CREATE_ALARM_RESPONSE') &&

        <Box ml={5}>
          {error && <Alert severity="error"> {error}</Alert>}
          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center" >
              <Grid item xs={2}>
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "5rem",
                  }}
                  component="h4"
                >
                  Title
                </FormLabel>
              </Grid>
              <Grid item xs={3} py={2}>
                <Controller
                  name={"title"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      required
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      sx={{ background: "white", marginLeft: "2rem",width:"90%" }}
                      placeholder="Title"
                      // error={!!errors.title}
                      helperText={errors.title ? errors.title?.message : null}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          {/* <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={2}>
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "8rem",
                  }}
                  component="h4"
                >
                  Sites Id
                </FormLabel>
              </Grid>
              <Grid item xs={3} py={2}>
                <Controller
                  name={"siteId"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <BasicSelector
                      disableAll={true}
                      options={sites}
                      selectorHight={"53px"}
                      value={site}
                      onChange={(data) => { setSite(data.target.value) }}
                      name={"Site"}
                      sx={{ background: "white", marginLeft: "2rem" }}
                      error={siteError}
                      helperText={
                        siteError ? 'Site ID is required !' : null
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl> */}

        <FormControl sx={{ display: "flex" }}>
        <Grid container alignItems="center">
              <Grid item xs={2}>
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "20rem",
                  }}sites
                  component="h4"
                >
                  Sites Id
                </FormLabel>
              </Grid>
             <Select
                value={site}
                onChange={(data) => {
                    setSite(prevState => ({
                        ...prevState,
                         data
                    }))
                }}
                isMulti
                name="permissions"
                className="basic-multi-select"
                classNamePrefix="select"
                error={siteError}
                options={sites}
                style={{zIndex :900}}
              />
               
            </Grid>
          </FormControl>

          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={2} >
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "8rem",
                  }}
                  component="h4"
                >
                  Company Id
                </FormLabel>
              </Grid>
              <Grid item xs={3} py={2}>
                <Controller
                  name={"companyId"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <BasicSelector
                      disableAll={true}
                      options={companies}
                      selectorHight={"53px"}
                      value={company}
                      sx={{ background: "white", marginLeft: "2rem" }}
                      onChange={(data) => { setCompany(data.target.value) }}
                      name={"Company "}
                      error={companyError}
                      helperText={
                        companyError ? 'Company ID is required !' : null
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>


          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={2} >
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "8rem",
                  }}
                  component="h4"
                >
                  User
                </FormLabel>
              </Grid>
              <Grid item xs={3} py={2}>
                <Controller
                  name={"userId"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <BasicSelector
                      disableAll={true}
                      options={users}
                      selectorHight={"53px"}
                      value={user}
                      sx={{ background: "white", marginLeft: "2rem" }}
                      onChange={(data) => { setUser(data.target.value) }}
                      name={"User"}
                      error={userError}
                      helperText={
                        companyError ? 'User is required !' : null
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>


          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={2} >
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "8rem",
                  }}
                  component="h4"
                >
                  Status
                </FormLabel>
              </Grid>
              <Grid item xs={3} py={2}>
                <Controller
                  name={"Status"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <BasicSelector
                      disableAll={true}
                      options={Status}
                      selectorHight={"53px"}
                      value={status}
                      sx={{ background: "white", marginLeft: "2rem" }}
                      onChange={(data) => { setStatus(data.target.value) }}
                      name={"Status"}
                      error={statusError}
                      helperText={
                        statusError ? 'Status is required !' : null
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={2}>
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "8rem",
                  }}
                  component="h3"
                >
                  Due Date
                </FormLabel>
              </Grid>
              <Grid item xs={5} py={2}>
                <FormControl sx={{ mb: 2, marginLeft: "2rem", width:" 21rem" }}>
                  <Controller
                    name="dueDate"
                    control={control}

                    render={({ field: { onChange, value } }) => (
                      <LocalDateSelector
                        label="none"
                        onChange={(text) => setDueDate(text)}
                        value={dueDate}
                        inputFormat="YYYY-MM-DD"

                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={2}>
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",
                    width: "8rem",
                  }}
                  component="h3"
                >
                  Due Time
                </FormLabel>
              </Grid>
              <Grid item xs={5} py={2}>
                <FormControl sx={{ mb: 2, background: "white", marginLeft: "2rem",width:" 21rem" }}>
                  <Controller
                    name="timeDue"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <LocalTimeSelector
                        label="none"
                        onChange={(text) => setDueTime(text)}
                        value={dueTime}

                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>


          <FormControl sx={{ display: "flex" }}>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <FormLabel
                  style={{
                    fontSize: "larger",
                    color: "black",

                  }}
                  component="h3"
                >
                  Description
                </FormLabel>
              </Grid>
              <Grid item xs={6} py={2}>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Description is Required",
                    minLength: {
                      value: 4,
                      message: "Value can't be more than 4!",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Description"
                      variant="standard"
                      multiline
                      rows={3}
                      onChange={(e) => {
                        setDesc(e.target.value)
                      }}
                      value={desc}
                      sx={{ background: "white" }}
                      error={descError}
                      helperText={
                        'Description is required! and at least 10 character long'
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>  
          </FormControl>
          <FormControl>
          <Button
            variant="outlined"
            sx={{
              py: "10px !important",
              px: "50px !important",
              marginTop:"5rem"
            }}
            // className={classes.buttoRoot}
            // disabled={loading}
            onClick={(e) => onSubmit(e)}
          >
            {action === 'add' ? 'Add' : 'Update'} Alarm Response
          </Button>
        </FormControl>


        </Box>
      }

     

    </Box >
  );
}
